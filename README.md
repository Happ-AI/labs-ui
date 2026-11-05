# Labs UI

Design system of Happ Labs products (labs.happ.tools): tokens, primitives, app shell and auth screens. React 19 + Tailwind v4 + Radix. Ships TypeScript source — no build step.

## Install

Pin a release tag (no registry, no token):

```json
"@happ-ai/labs-ui": "https://github.com/Happ-AI/labs-ui/archive/refs/tags/v0.1.1.tar.gz"
```

Peer dependencies: `react`, `react-dom`, `radix-ui`, `lucide-react`, `tailwindcss` v4, optionally `sonner`.

## Use

```css
@import "tailwindcss";
@import "@happ-ai/labs-ui/tokens.css";
@source "../node_modules/@happ-ai/labs-ui/src"; /* path relative to this CSS file */
```

```tsx
import { Button, Field, AppFrame, SignInScreen } from "@happ-ai/labs-ui";
```

- **Next.js:** add `transpilePackages: ["@happ-ai/labs-ui"]`.
- **Vite:** add `optimizeDeps.exclude` and `ssr.noExternal` for `@happ-ai/labs-ui`.

## Develop

```sh
pnpm install
pnpm storybook   # http://localhost:6010
pnpm test && pnpm typecheck
```

Releases: bump `version`, tag `vX.Y.Z`, push the tag; consumers update the tag in their URL.
