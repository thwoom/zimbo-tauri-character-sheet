# ZIMBO Tauri App – Codex Prompt

This document provides a condensed, structured prompt for use with OpenAI’s **Codex**. It is broken into two parts: a **Persistent Project Context** and a **Task Instruction Template**. Store the first part in a system prompt or separate note so that Codex retains the overall architecture and constraints. When you need help with a specific feature, supply a focused task instruction based on the template.

## Persistent Project Context

- **Project Name:** ZIMBO Tauri App — Dungeon World Character Sheet.
- **Tech Stack:** Tauri + React (JavaScript, no TypeScript).
- **Repository Structure:**
  - `zimbo-panel/` contains the Tauri project. Inside `src/` you will find `App.jsx` and sub‑folders `components/`, `utils/`, and `styles/`. Do not modify `src-tauri/`.
- **Character State Model:** A single `character` object maintained in `App.jsx`. It tracks level, hit points, experience, armor, six core attributes (with scores and modifiers), consumable resources, bonds, status effects, debilities, inventory items, selected advanced moves, action history, session notes, session recap, last session end timestamp and dice roll history. See the detailed state structure from the original Claude specification for exact keys and formulae.
- **Styling & Theme:** Cyber‑future aesthetic using neon gradients and glows. Dark backgrounds (`var(--color-bg-start)` to `var(--color-bg-end)`) with primary accent `var(--color-accent)`, plus purple and blue secondary accents. Use inline styles or the shared `cyber-theme.css` from `src/styles/`. Buttons and panels should have gradients, border glows and smooth transitions. Visual states for conditions (poisoned, burning, shocked, frozen, blessed, etc.) are achieved through tinted overlays.
- **Architecture Rules:**
  - All state lives in `App.jsx`; pass state and setters to child components via props.
  - Components must not mutate objects directly; use immutable updates when calling `setCharacter`.
  - Modals accept `character`, `setCharacter` and `onClose` props. They must open and close cleanly and handle escape key and outside clicks.
  - No external dependencies beyond React and Tauri APIs. Use built‑in hooks and modules only.
  - Test for edge cases: empty values, maximum values, invalid inputs and rapid user actions. Provide helpful error messages.
- **Existing Components:** The main shell (`App.jsx`) implements character state management, dice rolling (2d6 + modifiers with Dungeon World rules), resource management, status effects framework, inventory system, undo/redo history, visual effects and roll history. Completed modals include `DiceRoller`, `ResourceTracker`, `StatBlock`, session notes, `LevelUpModal`, `InventoryModal` and `StatusModal`. Future work includes `DamageModal`, `BondsModal`, `ExportModal` and auto‑save.

## Completed Features

### LevelUpModal

Enables character advancement when experience reaches the required threshold. Players can boost attributes, pick an advanced move and roll for additional hit points. Level and experience values update automatically after saving.

### InventoryModal

Provides a full inventory management interface. Users can equip gear, consume items or drop them, with all changes reflected immutably in the character state.

### StatusModal

Offers controls for adding or clearing status effects. It integrates with the existing status effects framework and supports closing via escape key or outside clicks.

## Task Instruction Template

When asking Codex to implement a new feature or component, provide a concise description following this outline. Avoid repeating the entire project context—Codex should already have that loaded.

**Current Task:** `Build [ComponentName]`  
**Purpose:** Describe in one sentence what the component does for the ZIMBO app.  
**Requirements:**

- Integrate with `App.jsx` by consuming `character` and updating it via `setCharacter`.
- Conform to the cyber‑theme styling (gradients, glows, dark backgrounds); use inline styles or the existing style utilities.
- Avoid additional dependencies; rely on React and Tauri only.
- Validate user input and handle edge cases gracefully (e.g. empty fields, maximum attribute scores).
- Ensure modals open/close via the `onClose` prop and support escape key and outside‑click dismissal.

**Acceptance Criteria:**

- [ ] Renders without errors in `npm run tauri dev`.
- [ ] All interactive elements (buttons, inputs, selectors) function and propagate state updates correctly.
- [ ] The component’s styles match the cyber‑future theme.
- [ ] Handles edge cases (empty or maximum values, invalid inputs, rapid clicks) and displays user‑friendly messages.
- [ ] No console errors during use.
- [ ] Mobile responsive — scales gracefully on smaller window sizes.

### Example: DamageModal

> **Current Task:** Build `DamageModal.jsx` for the ZIMBO Tauri App.
> **Purpose:** Records damage taken and updates the character's hit points.
> **Requirements:**
> • Allow the user to input a damage value and optional notes.
> • Subtract damage from `hp` without dropping below zero; flag when `hp` reaches zero.
> • Provide Save and Cancel buttons; update the main character state on save and close the modal on either action.
> **Acceptance Criteria:** The modal opens when triggered, applies damage immutably, handles invalid inputs gracefully and closes without errors.

Use this template for each new component or feature you ask Codex to help implement.
