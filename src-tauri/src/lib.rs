use directories::ProjectDirs;
use std::fs;
use std::path::{Component, Path, PathBuf};

fn resolve_app_path(path: &str) -> Result<PathBuf, String> {
    let relative = Path::new(path);
    if relative.is_absolute()
        || relative
            .components()
            .any(|c| matches!(c, Component::ParentDir))
    {
        return Err("invalid path: outside of application data directory".to_string());
    }

    let base = ProjectDirs::from("", "", "zimbo-panel")
        .ok_or_else(|| "failed to resolve application data directory".to_string())?
        .data_dir()
        .to_path_buf();
    let joined = base.join(relative);
    let canonical_base = base.canonicalize().map_err(|e| e.to_string())?;
    let canonical = match joined.canonicalize() {
        Ok(p) => p,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
            let parent = joined
                .parent()
                .ok_or_else(|| "failed to determine parent directory".to_string())?;
            let canonical_parent = parent.canonicalize().map_err(|e| e.to_string())?;
            canonical_parent.join(
                joined
                    .file_name()
                    .ok_or_else(|| "failed to resolve file name".to_string())?,
            )
        }
        Err(e) => return Err(e.to_string()),
    };
    if !canonical.starts_with(&canonical_base) {
        return Err("invalid path: outside of application data directory".to_string());
    }
    Ok(canonical)
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
