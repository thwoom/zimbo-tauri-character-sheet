
# Zimbo HUD Theming – Technical Playbook

A unified architecture and migration strategy for **PandaCSS + Arwes** in Vite + React.

---

## 1. Current State Audit

- Tailwind fully removed – only PandaCSS and Arwes active.
- Panda preflight disabled; tokens split across `panda.config.ts` and `theme.css`.
- `ArwesWrapper` wired but contains typos in event listeners; backgrounds don’t reliably mount.
- Panel components (Kranox/Octagon) mix inline colors and Panda css – needs refactor.
- Motion tokens exist in `src/motion/tokens.ts` but not consistently enforced.

---

## 2. PandaCSS Token Strategy

Define HUD palette, typography, spacing, radii, shadows, z-index. Centralize all values in Panda semantic tokens.

```ts
export default defineConfig({
  preflight: false,
  include: ['./src/**/*.{ts,tsx,js,jsx}'],
  outdir: 'src/styled-system',
  theme: {
    extend: {
      tokens: {
        colors: {
          cyan: { value: '#00D9FF' },
          magenta: { value: '#FF0080' },
          amber: { value: '#FFA726' },
          hudBg: { value: '#001114' },
          hudSurface: { value: '#021E26' },
          textHi: { value: '#7EFCF6' },
          textLo: { value: '#456C74' }
        },
        radii: { hud: { value: '6px' } },
        spacing: { md: { value: '1rem' }, lg: { value: '1.5rem' } },
        durations: { sm: { value: '160ms' }, md: { value: '220ms' } }
      },
      semanticTokens: {
        colors: {
          bg: { value: '{colors.hudBg}' },
          surface: { value: '{colors.hudSurface}' },
          text: { value: '{colors.textHi}' },
          muted: { value: '{colors.textLo}' },
          accent: { value: '{colors.cyan}' },
          accent2: { value: '{colors.magenta}' },
          warn: { value: '{colors.amber}' },
          'frames.line': { value: '{colors.cyan}' },
          'frames.bg': { value: 'color-mix(in oklab, {colors.cyan} 12%, transparent)' }
        }
      }
    }
  }
})
```

---

## 3. Arwes Integration

- **Root Providers**: `AnimatorGeneralProvider` (global durations), `BleepsProvider` (UI sounds).
- **Backgrounds**: `GridLines` + `Dots` under Animator, in relative container; opacity tuned for low-perf devices.
- **Frames**: `HUDPanel` using Arwes `FrameOctagon`/`FrameKranox` + Panda slot recipe for header/body/footer.

```tsx
export function HUDPanel({ title, subtitle, children }) {
  const { root, header, body } = panel({ density: 'default', emphasis: 'glass' })
  return (
    <Animated className={css({ display: 'block', position: 'relative' })}>
      <FrameOctagon animated style={{
        '--arwes-frames-line-color': 'var(--token-colors-frames-line)',
        '--arwes-frames-bg-color': 'var(--token-colors-frames-bg)'
      }}/>
      <div className={root}>
        {title && <div className={header}><h3>{title}</h3></div>}
        <div className={body}>{children}</div>
      </div>
    </Animated>
  )
}
```

---

## 4. React Compatibility

- Stay on **React 18.x** – Arwes not compatible with RSC or React 19 yet.
- **Do not wrap** Arwes subtree in `React.StrictMode` – double-invokes break animators.
- CSR only (fine for Vite + Tauri).
- Use **Profiler** to check re-renders on HUD-heavy trees.

---

## 5. Rollout Plan (Phased)

- **Stage 1: Fix & Freeze** – correct ArwesWrapper, lock Panda imports.
- **Stage 2: Tokens** – expand `panda.config.ts` with HUD semantic tokens; enforce motion tokens.
- **Stage 3: HUDPanel + Primitives** – implement HUDPanel slot recipe; convert typography and buttons.
- **Stage 4: Backgrounds & Audio** – add GridLines/Dots, Bleeps sounds, page transition animators.
- **Stage 5: Component Migration** – migrate all panels/widgets to HUD primitives; purge CSS modules.
- **Stage 6: QA & Perf** – run a11y and perf tests; update docs.

---

## 6. Developer Guardrails

- ESLint rule: ban inline hex colors/durations; enforce Panda tokens.
- Codemod: replace `style={{ color: '#...' }}` with `css({ color: '...' })`.
- Update PR template: require Panda recipe + Arwes Animator checks.

---

## 7. QA Checklist

- Verify WCAG AA contrast (text vs bg).
- Tab through app – focus rings visible on frames/buttons.
- Toggle `prefers-reduced-motion` – all animations skip/disable.
- Run React Profiler – no background/frame remounts on state changes.
- Perf test on low-DPR device – GridLines/Dots opacity scales down.

---

## 8. Rollout Roadmap (Task Table)

| Stage | Task | Owner | Dependencies | Done-When |
|-------|------|-------|--------------|-----------|
| 1. Fix & Freeze | Correct ArwesWrapper event listener typos; lock Panda imports. | Dev Lead | Current codebase | GridLines/Dots animate; Panda classes compile. |
| 2. Tokens | Expand panda.config.ts with HUD semantic tokens; enforce motion tokens. | UI Dev | Stage 1 | No hardcoded hex colors/durations remain. |
| 3. HUDPanel + Primitives | Implement HUDPanel slot recipe; convert typography/buttons to Panda. | Frontend Dev | Stage 2 | 3 screens render only HUD components. |
| 4. Backgrounds & Audio | Add GridLines/Dots backgrounds, Bleeps sounds, Animator transitions. | UI/UX Dev | Stage 3 | Animations/sounds work; reduced-motion disables them. |
| 5. Component Migration | Migrate panels/widgets to HUD primitives; purge CSS modules. | Team | Stage 4 | No CSS modules in runtime UI shells. |
| 6. QA & Perf | Run a11y, perf tests; update docs, PR templates. | QA + Docs | Stage 5 | WCAG AA passed; 60fps anims; docs reflect Panda/Arwes. |

---

