use directories::ProjectDirs;
use std::fs;
use std::path::{Component, Path, PathBuf};
use tauri::http::header::HeaderValue;
use tauri::webview::WebviewWindowBuilder;

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
    fs::create_dir_all(&base).map_err(|e| format!("failed to create data directory: {}", e))?;
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

/// Runs the Tauri application.
///
/// Returns `Ok` if the application starts successfully or a
/// `tauri::Error` if Tauri fails to launch.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> Result<(), tauri::Error> {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![write_file, read_file, get_os])
        .setup(|app| {
            WebviewWindowBuilder::from_config(
                app,
                app.config().app.windows.get(0).unwrap(),
            )?
            .on_web_resource_request(|_, response| {
                response.headers_mut().insert(
                    "X-Frame-Options",
                    HeaderValue::from_static("DENY"),
                );
            })
            .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use serial_test::serial;

    fn canonical_base() -> PathBuf {
        let base = ProjectDirs::from("", "", "zimbo-panel")
            .expect("failed to resolve application data directory")
            .data_dir()
            .to_path_buf();
        fs::create_dir_all(&base).expect("failed to create data directory");
        base.canonicalize()
            .expect("failed to canonicalize base path")
    }

    #[test]
    #[serial]
    fn relative_paths_resolve() {
        let base = canonical_base();
        let file = base.join("exists.txt");
        fs::create_dir_all(file.parent().unwrap()).unwrap();
        fs::write(&file, "test").unwrap();

        let resolved = resolve_app_path("exists.txt").unwrap();
        assert_eq!(resolved, file);
    }

    #[test]
    #[serial]
    fn invalid_paths_error() {
        assert!(resolve_app_path("/etc/passwd").is_err());
        assert!(resolve_app_path("foo/../bar.txt").is_err());
    }

    #[test]
    #[serial]
    fn nonexistent_paths_resolve_parent() {
        let base = canonical_base();
        let subdir = base.join("subdir");
        fs::create_dir_all(&subdir).unwrap();

        let expected = subdir.join("new.txt");
        let resolved = resolve_app_path("subdir/new.txt").unwrap();
        assert_eq!(resolved, expected);
    }

    #[test]
    #[serial]
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

    #[test]
    #[serial]
    fn creates_base_directory_if_missing() {
        let base = ProjectDirs::from("", "", "zimbo-panel")
            .expect("failed to resolve application data directory")
            .data_dir()
            .to_path_buf();
        if base.exists() {
            fs::remove_dir_all(&base).unwrap();
        }

        let expected = base.join("newfile.txt");
        let resolved = resolve_app_path("newfile.txt").unwrap();
        assert_eq!(resolved, expected);
        assert!(base.exists());
    }
}
