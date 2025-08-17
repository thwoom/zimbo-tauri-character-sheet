# Dev Server Content-Type

## Tokens

- None

## Usage

During development the Vite server no longer forces a universal `Content-Type` header. HTML pages continue to send `text/html; charset=utf-8` while module requests now respond with the appropriate type such as `application/javascript` or `application/wasm`.

## Migration Notes

No changes are required. Remove any local workarounds for incorrect module MIME types.
