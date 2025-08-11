use std::fs;
use std::path::{Component, Path, PathBuf};
use tauri::api::path::app_data_dir;

fn resolve_app_path(path: &str) -> Result<PathBuf, String> {
    let relative = Path::new(path);
    if relative.is_absolute()
        || relative
            .components()
            .any(|c| matches!(c, Component::ParentDir))
    {
        return Err("invalid path: outside of application data directory".to_string());
    }

    let mut base =
        app_data_dir().ok_or_else(|| "failed to resolve application data directory".to_string())?;
    base.push(relative);
    Ok(base)
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn write_file(path: &str, contents: &str) -> Result<(), String> {
    let path = resolve_app_path(path)?;
    let parent = path
        .parent()
        .ok_or_else(|| "failed to determine parent directory".to_string())?;
    fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    fs::write(path, contents).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_file(path: &str) -> Result<String, String> {
    let path = resolve_app_path(path)?;
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_os() -> String {
    std::env::consts::OS.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![write_file, read_file, get_os])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
