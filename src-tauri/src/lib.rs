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

#[cfg(test)]
mod tests {
    use super::*;

    fn canonical_base() -> PathBuf {
        let base = ProjectDirs::from("", "", "zimbo-panel")
            .expect("failed to resolve application data directory")
            .data_dir()
            .to_path_buf();
        fs::create_dir_all(&base).expect("failed to create data directory");
        base.canonicalize().expect("failed to canonicalize base path")
    }

    #[test]
    fn relative_paths_resolve() {
        let base = canonical_base();
        let file = base.join("exists.txt");
        fs::create_dir_all(file.parent().unwrap()).unwrap();
        fs::write(&file, "test").unwrap();

        let resolved = resolve_app_path("exists.txt").unwrap();
        assert_eq!(resolved, file);
    }

    #[test]
    fn invalid_paths_error() {
        assert!(resolve_app_path("/etc/passwd").is_err());
        assert!(resolve_app_path("foo/../bar.txt").is_err());
    }

    #[test]
    fn nonexistent_paths_resolve_parent() {
        let base = canonical_base();
        let subdir = base.join("subdir");
        fs::create_dir_all(&subdir).unwrap();

        let expected = subdir.join("new.txt");
        let resolved = resolve_app_path("subdir/new.txt").unwrap();
        assert_eq!(resolved, expected);
    }

    #[test]
    fn write_and_read_file_roundtrip() {
        let base = canonical_base();
        let target = base.join("integration/test.txt");
        if let Some(parent) = target.parent() {
            fs::create_dir_all(parent).unwrap();
        }

        write_file("integration/test.txt", "hello").unwrap();
        let contents = read_file("integration/test.txt").unwrap();
        assert_eq!(contents, "hello");

        fs::remove_file(target).unwrap();
    }
}
