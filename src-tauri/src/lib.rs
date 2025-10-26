// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod fs;

use fs::move_file;
use tauri::Listener;
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, move_file])
        .setup(|app| {
            let splash = app.get_webview_window("splashscreen").unwrap();
            let main = app.get_webview_window("main").unwrap();
            main.hide().unwrap();

            // Listen for a signal from the frontend
            tauri::async_runtime::spawn(async move {
                // Clone main before moving into the closure
                let main_clone = main.clone();
                main.once("frontend-ready", move |_| {
                    splash.close().unwrap();
                    main_clone.show().unwrap();
                });
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
