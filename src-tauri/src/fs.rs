use std::fs;
use std::path::Path;
use tauri::command;

#[command]
pub fn move_file(source: String, target_dir: String) -> Result<String, String> {
    let source_path = Path::new(&source);
    let file_name = match source_path.file_name() {
        Some(name) => name,
        None => return Err("Invalid source file name".to_string()),
    };

    let target_path = Path::new(&target_dir).join(file_name);

    fs::rename(&source_path, &target_path).map_err(|e| format!("Failed to move file: {}", e))?;

    Ok(format!(
        "File moved from {} to {}",
        source_path.display(),
        target_path.display()
    ))
}
