# RetroStack Web

Marketing website for RetroStack - a collection of tools and resources for retro computing enthusiasts.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Testing**: Jest (unit) + Playwright (e2e & visual)
- **Deployment**: GitHub Pages (static export)

## Development Commands

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint
npm run test             # Jest unit tests
npm run test:watch       # Jest in watch mode
npm run test:coverage    # Jest with coverage
npm run test:e2e         # Playwright e2e tests
npm run test:e2e:ui      # Playwright with UI
npm run test:visual      # Visual regression tests
npm run test:all         # Run all tests
npm run validate         # Full validation suite
npm run deploy           # Deploy to GitHub Pages
```

## Project Structure

- `src/app/` - Next.js App Router pages
  - `systems/` - Systems pages (computers, game-consoles, sdks, trainer-boards, others)
  - `tools/` - Tools pages (character-rom-editor, binary-rom-editor, emulators, etc.)
  - `resources/` - Resources pages (datasheets, documentation)
- `src/components/` - React components
  - `layout/` - Header, Footer, Navigation, MobileMenu, ToolLayout
  - `sections/` - Hero, Features, SystemsPreview, ToolsPreview, CallToAction, PlaceholderPage
  - `ui/` - Button, Card, Container, OverflowMenu, ResponsiveToolbar
  - `effects/` - GridBackground, NeonText
- `src/hooks/` - Custom React hooks (useOutsideClick, useMediaQuery, useResizeObserver)
- `src/lib/` - Shared utilities and constants
- `e2e/` - Playwright e2e tests

## Key Features

- Responsive design with mobile menu
- RetroStack branding with gradient accents
- Systems and tools preview sections
- Visual regression testing
- Static export for GitHub Pages deployment

## Coding Conventions

- **No barrel files**: Do not create index.ts files that re-export from other files. Import directly from the source file instead of using barrel exports. This keeps the dependency graph explicit and avoids circular import issues.
