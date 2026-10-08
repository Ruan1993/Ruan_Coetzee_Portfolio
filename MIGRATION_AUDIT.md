# React and TypeScript migration audit

## Safe migration boundary

The existing `index.html`, `script.js`, `style.css`, generated `tailwind.css`, all assets, the contact form, and Blop remain unchanged. The first React 19 migration slice is available at `react-preview.html`; Vite builds both pages. This avoids switching production behavior before replacement sections have feature parity.

## Current architecture and functionality

- A static, single-page portfolio with anchor navigation for home, about, projects, certificates and contact.
- Tailwind-generated utilities plus custom CSS, with responsive breakpoints and a mobile menu.
- Project tabs for websites, GIS/research, and design galleries; image/document links open the original assets.
- Modal certificate lists, scroll progress/back-to-top controls, cursor effects, Vanta/Three background animation and Feather icons.
- Web3Forms contact submission with client-side status handling.
- Google Analytics 4 using measurement ID `G-J4LV7MF372`.
- Blop chatbot UI in the static page, with a Render-hosted Flask API. The client sends `{ query, websiteContent, style, history }` and expects `{ text }`; `/chat`, `/api/chat`, `/healthz`, and `/` are retained without contract changes.

## Content and information architecture findings

- The current hero and profile position web development/AI first. Teaching and the in-progress PGCE are not represented in the legacy page.
- Verified legacy qualifications include a BA in Humanities (Geography and History) and a BSc Honours in Geography and Environmental Sciences. The React preview states that the PGCE is in progress and does not claim completion.
- Existing media inventory includes 30 PNGs, 13 PDFs, 3 JPGs and 3 JPEGs across websites, GIS maps, research, logos, posters, QR work, certificates and the CV.
- No C&C Wedding project was found or added.

## SEO, accessibility and responsive findings

- The legacy page has a title and viewport meta tag, but lacks a meta description, canonical URL, Open Graph/Twitter metadata and structured data.
- The single `h1` page structure is generally sound, but icon-only social links need accessible names and external links should consistently use `rel="noopener noreferrer"`.
- Custom cursor/motion effects need a reduced-motion path; keyboard focus visibility and modal focus trapping need verification.
- The responsive design uses Tailwind breakpoints and custom media queries. Long galleries and animated effects are the main mobile performance risks.
- The React preview adds semantic landmarks, a skip link, visible focus states, labelled navigation, reduced-motion handling and a keyboard-accessible mobile menu.

## Integrations and secret handling

- Third parties: Google Analytics, CDNJS, jsDelivr, Feather Icons, Three.js, Vanta.js, Web3Forms, Render, Google Gemini through LangChain, GitHub, LinkedIn and Facebook.
- Backend model credentials are read from `GOOGLE_API_KEY`, `GOOGLE_GENAI_API_KEY` or `GEMINI_API_KEY`; no matching environment/key files are tracked.
- The Web3Forms access key is embedded in the existing HTML. Although this class of browser form key is necessarily public, it is abuse-sensitive and should be domain-restricted/rotated in Web3Forms. It was not copied into React code.
- Flask CORS defaults to `*` when `CORS_ORIGINS` is unset. Production should explicitly set the portfolio origins.

## Migration architecture

- `src/types`: shared strict TypeScript models.
- `src/data`: typed portfolio, qualification, navigation and gallery data.
- `src/components`: reusable header, focus card, qualification list and footer.
- `src/App.tsx`: teaching-first composition for the isolated preview.
- `react-preview.html`: non-production React entry point.
- `vite.config.ts`: multi-page build retaining legacy `index.html` alongside the preview.

## Next migration slices

1. Confirm teaching-practice details, institution and dates before publishing them.
2. Migrate all legacy project/gallery records into typed data, preserving exact URLs and asset names.
3. Rebuild contact submission using environment-backed configuration and domain-restricted form key.
4. Port Blop's client UI against the unchanged Flask contract, updating its training content for the teaching-first profile.
5. Replace CDN scripts with pinned npm packages or lightweight native alternatives, then test reduced-motion behavior.
6. Run link, accessibility, responsive and visual-regression checks before promoting React to `index.html`.
