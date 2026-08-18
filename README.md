# Qraft

Privacy-first QR code studio. Create, customize, and export QR codes — entirely in your browser. No server, no tracking, no data leaves your machine.

## Features

- **10 QR types** — URL, Text, Email, Phone, SMS, Contact (vCard), Wi-Fi, Calendar Event, Location, Custom
- **Live preview** — QR code updates as you type
- **Customization** — colors, module style (square, rounded, dot), error correction level
- **Export** — PNG, SVG, clipboard copy, Web Share API
- **Dark mode** — light, dark, and system theme support
- **Zero backend** — everything runs client-side

## Tech Stack

- [Next.js 16](https://nextjs.org/) with static export
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide](https://lucide.dev/) for icons
- [qrcode](https://github.com/soldair/node-qrcode) for QR generation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Static output is written to the `out/` directory. Deploy it anywhere — GitHub Pages, Netlify, Vercel, or any static host.

## GitHub Pages

1. Set `output: "export"` in `next.config.ts` (already configured)
2. Run `npm run build`
3. Deploy the `out/` directory to your GitHub Pages branch

If deploying to a subpath (e.g. `username.github.io/qraft`), update `basePath` in `next.config.ts`:

```ts
const nextConfig = {
  output: "export",
  basePath: "/qraft",
  // ...
};
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout, fonts, metadata
│   └── page.tsx        # Main page
├── components/
│   └── qraft/
│       ├── CustomizePanel.tsx  # Color, size, style, error correction
│       ├── ExportRow.tsx        # PNG, SVG, clipboard, share
│       ├── Header.tsx           # Top bar with logo, theme toggle
│       ├── Logo.tsx             # QR-shaped Q logo
│       ├── QRForm.tsx           # Dynamic form per QR type
│       ├── QRPreview.tsx        # Live QR code display
│       └── TypeBar.tsx          # QR type selector grid
├── hooks/
│   └── useQR.ts            # Core state: encoding, validation, generation
├── qr/
│   ├── encoders.ts          # Payload encoding for all 10 types
│   ├── types.ts             # Type definitions and form schemas
│   └── validators.ts        # Input validation
└── styles/
    ├── globals.css           # Reset, form elements, components
    ├── themes.css            # Light/dark theme variables
    └── tokens.css            # Spacing, typography, radii, transitions
```

## License

[MIT](LICENSE)
