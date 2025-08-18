// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
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
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![get_os])
        .run(tauri::generate_context!())?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_os_returns_value() {
        assert!(!get_os().is_empty());
    }
}

