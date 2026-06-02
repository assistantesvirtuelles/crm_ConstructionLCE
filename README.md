# Construction LCE CRM

The visual foundation of a CRM application for Construction LCE — design system and layout shell only (no features, data, or API calls yet).

## Tech stack

- **React 18** with **Vite**
- **React Router DOM** for routing
- **Lucide React** for icons
- JavaScript only (no TypeScript)
- Styling via CSS custom properties + inline styles

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally

## Project structure

```
src/
  main.jsx                  App entry
  App.jsx                   Router + routes
  styles/globals.css        Design tokens, ambient glow, keyframes
  components/
    layout/                 AppShell, Sidebar, Header
    ui/                     Card, Button, StatusPill, EmptyState
  pages/                    Dashboard + placeholder pages
```

## Design system

- **Fonts:** Plus Jakarta Sans (headings/labels), DM Sans (body)
- **Brand accent:** Construction LCE green (`#2ecc52` → `#22a344`)
- **Dark surfaces** with a subtle dual radial-gradient glow behind all content
