use regex::Regex;
use serde::Serialize;
use std::fs;
use std::fs::File;
use std::io::{BufReader, Read};
use std::path::Path;
use tauri::command;
use tauri::{AppHandle, Manager, Runtime};

#[derive(Serialize)]
pub struct WorkspaceEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub method: String,
    pub children: Option<Vec<WorkspaceEntry>>,
}

pub fn read_file_head(path: &str) -> Option<String> {
    let file = File::open(path).ok()?;
    let mut reader = BufReader::new(file);

    const HEAD_LIMIT: usize = 100;
    let mut buffer = vec![0; HEAD_LIMIT];
    let read = reader.read(&mut buffer).ok()?;

    buffer.truncate(read);
    String::from_utf8(buffer).ok()
}

pub fn extract_method_from_head(src: &str) -> String {
    let re = Regex::new(
        r#"content\s*:\s*\{[^}]*?\bmethod\s*:\s*["'`](GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)["'`]"#
    ).unwrap();

    re.captures(src)
        .and_then(|c| c.get(1))
        .map(|m| m.as_str().to_uppercase())
        .unwrap_or_else(|| "GET".into())
}

#[command]
pub fn read_workspace_recursive<R: Runtime>(
    app: AppHandle<R>,
    workspace: &str,
) -> Result<Vec<WorkspaceEntry>, String> {
    // 1. Get the base AppData directory
    let mut root = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Could not resolve AppData: {}", e))?;

    // 2. Append the specific workspace sub-folder
    // If workspace is an empty string, it stays at the root of AppData
    if !workspace.is_empty() {
        root.push(workspace);
    }

    // println!("Scanning directory: {:?}", root);

    // 3. Ensure the path exists before scanning
    if !root.exists() {
        return Err(format!("Path does not exist: {:?}", root));
    }

    // 4. Call your existing scan logic
    // Assuming scan_dir is defined elsewhere in your code
    Ok(scan_dir(&root))
}

fn trim(full_path: &str) -> &str {
    let marker = "com.owais.zap/";
    match full_path.find(marker) {
        Some(idx) => &full_path[idx + marker.len()..],
        None => full_path,
    }
}

fn scan_dir(path: &Path) -> Vec<WorkspaceEntry> {
    let mut result = Vec::new();

    if let Ok(entries) = fs::read_dir(path) {
        // println!("{:?} entries", entries);
        for entry in entries.flatten() {
            // println!("{:?}", entry);
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();

            let is_dir = path.is_dir();
            let path_str = path.to_string_lossy().to_string();

            if is_dir {
                // recurse into folder
                let children = scan_dir(&path);

                result.push(WorkspaceEntry {
                    name,
                    path: trim(&path_str).to_string(),
                    is_dir: true,
                    method: "".into(), // folders don't have method
                    children: Some(children),
                });
            } else {
                // read only head bytes of file
                let head = read_file_head(&path_str).unwrap_or_default();
                // println!("{}", head);

                // extract method from `content.method`
                let method = extract_method_from_head(&head);
                println!("{}", method);

                result.push(WorkspaceEntry {
                    name,
                    path: trim(&path_str).to_string(),
                    is_dir: false,
                    method,
                    children: None,
                });
            }
        }
    }

    result
}
