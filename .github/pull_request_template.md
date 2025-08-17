# UX Stage 0X: <short, imperative title>

> **Plan adherence:** I read and followed [docs/ux-upgrade-plan.md] (plan version: **\_).
> If not, explain why: **\*\*\*\*\***\*\_\_\_\_\*\***\*\*\*\*\*\*\*\*

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
  - adix-ui/\*, @/components/ui (shadcn), ramer-motion, ailwindcss
  - Optional: sparticles, @react-three/fiber (flagged)

## Design Tokens

> All visuals must be token-driven; no hard-coded magic values.

| Token           | Old | New | Notes |
| --------------- | --- | --- | ----- |
| color.accent    |     |     |       |
| radius.md       |     |     |       |
| shadow.glow     |     |     |       |
| motion.duration |     |     |       |

## Feature Flags

> Heavy effects off by default.

| Flag                      | Default |
| ------------------------- | ------- |
| effects.particles.enabled | false   |
| effects.three.enabled     | false   |

## Accessibility

- [ ] Radix focus trap/ARIA
- [ ] Keyboard-only verified
- [ ] prefers-reduced-motion respected
- [ ] WCAG AA contrast for all states

## Performance

- [ ] No unnecessary re-renders
- [ ] Heavy effects unmounted when flags off
- [ ] Dev/demo routes lazy-loaded
- Baseline metrics / profiler notes:

## Tests & Docs

- [ ] Docs in docs/ (tokens, motion, usage/migration)
- [ ] README updated
- [ ] Minimal tests if sensible

## Migration Notes

- How to adopt patterns; breaking changes if any

## Screenshots / Demos

> No binary assets. Code-generated previews only.

### Checklist

- [ ] No binary assets introduced
- [ ] Scope limited to this stage
