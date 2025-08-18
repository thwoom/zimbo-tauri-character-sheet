# File Storage

The application stores character data using Tauri's filesystem APIs. Files are
read and written under the app's data directory via `BaseDirectory.AppData`.

When running outside Tauri, data falls back to `localStorage` or a manual file
download/upload flow.
