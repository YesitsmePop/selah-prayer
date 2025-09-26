A calm, minimal web app for submitting short prayers and reflections. Built with Next.js (App Router) and TypeScript, it features subtle UI flourishes — glimmering side flashes, a vaporized-letters input effect, and a lightweight WPM counter.

---

## Table of contents

- About
- Demo & quick preview
- Tech stack
- Install & run
- Development notes
- Visual features & how to tweak them
- Accessibility & testing
- Deployment
- Project structure
- License

---

## About

Selah is a small, meditative web experience for short prayers and reflection. It focuses on a minimal interface and subtle motion: floating vapor letters, faint glimmers at screen edges, and a small WPM indicator to show writing pace.

The site is built with modern Next.js conventions (App Router) and TypeScript, and styled using Tailwind utilities plus a handful of bespoke CSS rules for the motion and visual polish.

---

## Quick preview

Try it locally and see the vaporized text effect, glimmers and focus glow:

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

Tip: on small screens the UI uses condensed sizes — tweak mobile overrides in `app/globals.css` if you want larger or smaller inputs.

---

## Tech stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + custom global CSS
- Optional: deploy to Vercel or similar platforms

---

## Developer quick start

1. Install dependencies

```bash
pnpm install
```

2. Run dev server

```bash
pnpm dev
```

3. Open `http://localhost:3000`

---

## Visual features & where to tweak them

Below are the primary visual systems and where to adjust them.

### 1) Glimmer (side flashes)

- File: `components/ui/glimmer.tsx`
- Styles: `app/globals.css` under the `.glimmer` rules and `@keyframes glimmerMove`.
- Tweak: control spawn frequency/timing randomness inside the component; change radius and blur in CSS.

### 2) Vaporized text

- File: `app/page.tsx` — typed characters are intercepted, pushed into a short-lived array, and rendered as ephemeral spans.
- Styles: `app/globals.css` defines `@keyframes vaporFade` (and `.vapor-char-display`).
- Important: when you change the animation duration, update the removal timeout in `page.tsx` to match so characters are removed at the animation's end.

### 3) Visible caret & focus glow

- The visible caret is `.vapor-caret` (CSS-controlled). Native caret is hidden to allow fine visual control.
- `.prayer-box:focus-within` controls the outer glow. Tweak shadow and spread for different visual weight.

### 4) WPM counter

- Sampling in `page.tsx` (2s interval by default). The smoothing uses a weighted average to keep numbers stable.

---

## Accessibility & performance

- `prefers-reduced-motion` is honored for non-essential animations (glimmer). Consider providing a UI toggle if you anticipate many motion-sensitive users.
- CSS animations are lightweight; keep an eye on dropped frames if you add complex particle systems.

---

## Testing & troubleshooting

- If vapor characters don't fade: check `app/globals.css` for `@keyframes vaporFade` and ensure the cleanup timeout in `app/page.tsx` matches the animation duration.
- If placeholder or caret sizes look off on mobile: inspect `@media (max-width: 640px)` overrides in `app/globals.css`.

---

## Deployment

Deploy like any Next.js site. For Vercel it's a one-liner:

```bash
vercel --prod
```

Or push to a branch and let your CI deploy automatically.

---

## Project structure (top-level)

```
app/
  globals.css       # global style and animations
  layout.tsx        # layout and site-level components
  page.tsx          # main UI, vapor logic
components/
  ui/
    glimmer.tsx     # client-only glimmer spawner
public/
  placeholder-logo.png
  icon.png
package.json
pnpm-lock.yaml
README.md
```

---

## License

MIT

---
