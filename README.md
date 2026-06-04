# Main Site UI Kit

A React recreation of `wiseandsavvy.com` — the studio hub that introduces all five worlds.

## Components

- `SiteHeader` — sticky glass header with lockup, tracked-caps nav, primary CTA
- `AmbientBackground` — ambient smoke + grid + noise (runs forever)
- `Hero` — display serif headline + right-side "Map" glass panel
- `VectorDivider` — signature curved section divider (alternate `flip` prop)
- `WorldsLedger` — ledger-row list of the five worlds (eyebrow / title / phase / lead / ticks / CTA)
- `Artifacts` — 4-up card grid of documents
- `Inquiries` — contact form
- `SiteFooter` — lockup + columns of links
- `Button`, `Eyebrow` — primitives

## Source of truth

Built from `Wise and Savvy Universal/mainwebsite/` (Next.js 15 + Tailwind v4). Content mirrors `content/site-content.ts`. Ambient smoke SVGs are the real assets, copied to `assets/`.

## Caveats

- The real site uses framer-motion scroll reveals; this kit keeps content visible (no JS reveal) so every section renders in the preview.
- No icon set — site is icon-free by design.
- CTA handlers scroll-to-section instead of navigating to per-world routes (this is a single-file kit).
