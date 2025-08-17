# Undo Hook Usage

The `useUndo` hook manages the character's change history.

## Usage

Call `useUndo` before defining any callbacks that invoke `saveToHistory`.
This ensures the `saveToHistory` function is available when callbacks are created.

```jsx
const { saveToHistory, undoLastAction } = useUndo(character, setCharacter, setRollResult);
saveToHistoryRef.current = saveToHistory;
```

## Migration Notes

If callbacks reference `saveToHistory`, reorder the `useUndo` call so it appears
before those callbacks. This prevents `saveToHistory` from being `undefined` in
closure scopes.
