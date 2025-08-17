# UX Upgrade Plan

Version: 0.2.0

This plan outlines the staged approach for upgrading the project's UX. Each PR should reference this document and note the plan version.

# UX Modernization Plan

## Current UI Gaps

- Bespoke components and CSS modules lead to inconsistent look and feel.
- Manual focus management in modals (`useModalTransition`) risks accessibility issues.
- Inputs and form controls are plain HTML elements without shared styling or validation.
- No centralized design token system; magic values appear across components.
- Lack of toast/notification primitive and unified layout utilities.

## Component Inventory

### Buttons

- `common/Button`
- `common/ButtonGroup`

### Inputs

- Native `<input>` fields across modals (`AddItemModal`, `AidInterfereModal`, `BondsModal`, `DamageModal`, `EndSessionModal`, `InventoryModal`, `Settings`)
- `<select>` in `CharacterSwitcher` and `Settings`
- `<textarea>` in `SessionNotes`, `InventoryModal`, `EndSessionModal`
- Checkboxes and toggles in `Settings`

### Dialogs / Modals

- `AddItemModal`
- `AidInterfereModal`
- `BondsModal`
- `DamageModal`
- `EndSessionModal`
- `ExportModal`
- `InventoryModal`
- `LastBreathModal`
- `LevelUpModal`
- `RollModal`
- `StatusModal`
- `GameModals` wrapper

### Cards / Panels

- `InventoryPanel`
- `CharacterStats`
- `Settings`
- `DiagnosticOverlay`
- `panelStyle` helper
- `styles.js` shared panel glassmorphism

### Lists

- `InventoryPanel` item lists
- `StatusTray` status list
- `CharacterStats` list of stats
- `SessionNotes` entries

### HUD / Status Widgets

- `CharacterHUD` (includes `CastIndicator`, `Nameplate`, `ResourceBars`, `Portrait`, `StatusTray`)
- `PerformanceHud`
- `DiagnosticOverlay`
- `StatusTray`

### Toasts / Messages

- No toast primitive; inline `Message` component only

### Layout Primitives

- CSS modules per component
- Shared `panelStyle` object; no flex/grid utilities
- Ad-hoc spacing and breakpoints; no Tailwind utilities yet

## Bespoke Logic to Replace with Radix Primitives

- Custom `Button` / `ButtonGroup` → shadcn/ui `Button` and Radix `ToggleGroup`.
- Native inputs, checkboxes, selects → Radix `Input`, `Checkbox`, `Select`, `Textarea`.
- All modals with `useModalTransition` → Radix `Dialog` / `AlertDialog` with Framer Motion transitions.
- `Message` alerts → Radix `Toast` or `Alert`.
- Manual overlays (`DiagnosticOverlay`, `StatusTray`) → Radix `Popover` / `Tooltip` as appropriate.

## Library Recommendations

- **Tailwind CSS**: utility-first styling and theme mapping for design tokens.
- **Radix UI**: unstyled, accessible primitives (Dialog, Select, Checkbox, Popover, Toast).
- **shadcn/ui**: optional prebuilt shells on top of Radix + Tailwind for faster adoption.
- **Framer Motion**: animation engine with `prefers-reduced-motion` support.
- **tsParticles** _(feature-flag)_: optional particle effects for ambient backgrounds.
- **@react-three/fiber + three** _(feature-flag)_: optional 3D scenes and WebGL effects.

## Design Token Map

### Colors

- `color.primary`: `--color-accent`
- `color.primary.dark`: `--color-accent-dark`
- `color.neutral.{100-900}`: `--color-gray-*`
- `color.success`: `--color-success`
- `color.warning`: `--color-warning`
- `color.danger`: `--color-danger`
- `color.info`: `--color-info`
- `color.background.{start,end}`: `--color-bg-start`, `--color-bg-end`
- `color.neon`: `--color-neon` (glow accents)
- `color.glass.base`: `--glass-bg`
- `color.glass.border`: `--glass-border`

### Spacing

- `space.0`: `0`
- `space.1`: `0.25rem`
- `space.2`: `0.5rem` (`--space-sm`)
- `space.3`: `0.75rem`
- `space.4`: `1rem` (`--space-md`)
- `space.6`: `1.5rem` (`--space-lg`)
- `space.8`: `2rem`

### Radii

- `radius.sm`: `0.375rem` (`--hud-radius-sm`)
- `radius.md`: `0.75rem` (`--hud-radius`)
- `radius.lg`: `1rem`
- `radius.full`: `9999px`

### Shadows

- `shadow.sm`: `0 1px 2px var(--panel-shadow)`
- `shadow.md`: `0 4px 6px var(--panel-shadow)`
- `shadow.glow`: `0 0 8px var(--glow-shadow)`
- `shadow.neon`: `0 0 10px var(--color-neon)`
- `shadow.glass`: `0 8px 32px var(--panel-shadow)`

### Z-Index

- `z.base`: `0`
- `z.dropdown`: `100`
- `z.overlay`: `1000`
- `z.modal`: `1100`
- `z.toast`: `1200`
- `z.hud`: `1300`

### Typography

- `font.heading`: `--font-heading`
- `font.body`: `--font-body`
- `text.xs`: `0.65rem`
- `text.sm`: `0.75rem` (`--font-size-sm`)
- `text.base`: `1rem` (`--font-size-body`)
- `text.lg`: `1.25rem`
- `text.xl`: `2.5rem` (`--font-size-heading`)

### Motion

- `motion.fast`: `150ms` (`--hud-transition-fast`)
- `motion.base`: `300ms` (`--hud-transition`)
- `motion.slow`: `500ms` (`--hud-transition-slow`)
- `easing.default`: `cubic-bezier(0.4, 0, 0.2, 1)`
- `easing.emphasized`: `cubic-bezier(0.2, 0, 0, 1)`
- Respect `prefers-reduced-motion` by reducing durations to `0ms`.

## Staged Rollout

1. **Stage 1 – Token & Tailwind Setup**
   - Introduce Tailwind, map existing CSS variables to Tailwind theme.
   - **Risk**: build step breakage; **Rollback**: revert Tailwind config and CSS changes.
2. **Stage 2 – Form & Button Primitives**
   - Replace `Button`, inputs, selects with Radix + shadcn equivalents.
   - **Risk**: interaction regressions; **Rollback**: keep legacy components side-by-side and toggle via flag.
3. **Stage 3 – Dialog Migration**
   - Swap modal components to Radix `Dialog` with Framer Motion transitions.
   - Use `AnimatePresence` with shared `fadeScale` variants and the
     `useMotionTransition` helper to disable motion when users enable
     `prefers-reduced-motion`.
   - **Risk**: focus traps and overlay conflicts; **Rollback**: revert to `useModalTransition` modals.
4. **Stage 4 – HUD & Toasts**
   - Refactor HUD widgets to Radix `Popover`/`Tooltip`; add Radix `Toast` system.
   - **Risk**: visual overlap or performance hits; **Rollback**: disable new widgets via flag.
5. **Stage 5 – Optional Effects**
   - Gate `tsParticles` and `@react-three/fiber` features behind off-by-default flags.
   - **Risk**: heavy bundle size; **Rollback**: ensure flags default to `false`.
6. **Stage 6 – Legacy Cleanup**
   - Remove unused CSS modules and `useModalTransition` hook.
   - **Risk**: residual styles; **Rollback**: keep fallback branches until stable.

## Rollback Notes

- Each stage is isolated; reverting the corresponding commit or disabling feature flags restores prior behavior.
- Maintain WCAG AA contrast and honor `prefers-reduced-motion` throughout.
