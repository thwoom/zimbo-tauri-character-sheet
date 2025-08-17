# UX Stage 0X: <short, imperative title>

## Summary

- **Scope:** What this stage does and does not change (keep tight).
- **Motivation:** Why this is needed (UX/a11y/perf/product reasons).
- **User impact:** What the user will notice (or “no visual change” if plumbing).

## Changes

- [ ] New/updated components:
- [ ] Replaced bespoke logic with **Radix** primitives:
- [ ] Styling via **Tailwind** tokens/utilities:
- [ ] Motion via **Framer Motion**:
- [ ] Dev-only routes/demos (if any):

## Libraries

- Added/updated packages (with reasons):
  - `radix-ui/*` — accessible primitives
  - `@/components/ui` (shadcn) — shells for styling consistency
  - `framer-motion` — motion system
  - `tailwindcss` — tokens/utilities
  - Optional: `tsparticles` / `@react-three/fiber` — **feature-flagged**

## Design Tokens

> All visuals must be token-driven; no hard-coded magic values.

| Token           | Old | New | Notes |
| --------------- | --- | --- | ----- |
| color.accent    |     |     |       |
| radius.md       |     |     |       |
| shadow.glow     |     |     |       |
| motion.duration |     |     |       |

## Feature Flags

> Heavy effects **off by default**.

| Flag                      | Default | Notes |
| ------------------------- | ------- | ----- |
| effects.particles.enabled | false   |       |
| effects.three.enabled     | false   |       |

## Accessibility

- [ ] Uses **Radix** focus trap/ARIA where applicable
- [ ] Keyboard-only flows verified
- [ ] `prefers-reduced-motion` respected
- [ ] WCAG AA contrast verified for idle/hover/active/focus

## Performance

- [ ] No unnecessary re-renders (memoization where needed)
- [ ] Heavy effects unmounted when flags are off
- [ ] Dev/demo routes lazy-loaded
- Baseline metrics / profiler notes:

## Tests & Docs

- [ ] Updated/added docs in `docs/` (tokens, motion, usage/migration)
- [ ] README updated (if required)
- [ ] Minimal tests where sensible

## Migration Notes

- How to adopt new components/patterns:
- Breaking changes (if any):

## Screenshots / Demos

> **No binary assets added to the repo.** Attach code-generated previews in the PR UI if helpful.

### Checklist

- [ ] No binary assets (PNG/JPG/GIF/WebP) introduced
- [ ] Scope limited to this stage
- [ ] Branch format: `codex/{feature}`
