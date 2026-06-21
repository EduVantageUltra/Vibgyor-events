# Vibgyor Events

Luxury Indian wedding & celebration designers — a premium, animated Next.js website with a built-in, local-only visual editor.

## Tech
- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **GSAP + Lenis** (animations, smooth scroll) · **Tailwind v4** (editor UI)
- **Puck** visual editor (local-only)

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000  (this project uses -p 3002 if 3000 is busy)
```

## The visual editor (`/editor`)
The editor is **local-only by design** — it returns **404 on any deployed/production build** and only opens on a local dev machine. Edit locally -> `git push` -> the live site updates automatically. A bad edit can never crash the live site.

## Real photos / videos
All imagery is centralised in `src/lib/media.ts`. To use your own footage, drop files in `public/media/` and point the URLs there (see `public/media/README.txt`).

## Structure
- `src/app/(site)/` — the public website (home, studio, experiences, weddings, contact, legal)
- `src/components/vibgyor/` — the Vibgyor design + effects
- `src/app/editor/` — the local-only editor
- `src/lib/`, `src/data/` — content, config and the editor's JSON store
