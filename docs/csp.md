# Content Security Policy

Version: 0.1.0

This project uses a restrictive Content Security Policy for the Tauri backend. The policy allows only local assets by default and explicitly permits fonts from `https://fonts.gstatic.com`.

## Migration Notes

- Ensure any external fonts are served from `fonts.gstatic.com`.
- Inline styles are allowed to simplify style injection during the UX upgrade.
- No additional tokens were introduced in this change.
