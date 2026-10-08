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

## Completed catalog migration slice

- All 36 legacy public project/gallery records are represented in typed React data: 4 websites, 11 GIS maps, 2 research documents, 9 logos, 8 posters/stickers and 2 QR designs.
- All 10 certificate document records are represented: 1 degree, 5 AI Engineering certificates and 4 Web Development/SQL certificates.
- Original titles, descriptions, categories, action labels, external URLs and legacy path strings are retained. Several original HTML paths use Windows backslashes; `legacyPath` preserves those strings while React uses forward-slash, Vite-generated asset URLs for cross-platform builds.
- The Summer vs Winter card has inconsistent legacy paths: its wrapping link contains a doubled slash while its image and action link contain one slash. The canonical one-slash asset path is retained in typed data.
- The original `GEOG 671 Mini Dissertation - R. Coetzee 30195543.pdf` reference is currently missing from the working tree. The user-owned `- Copy.pdf` file was not substituted, renamed or committed.
- `Still Greens 5.png`, the CV PDF and the profile portrait exist as source assets but are not gallery/certificate records in the legacy project and certificate sections. The portrait remains used by the React hero; the other two were not newly published as catalog items.

## Completed React contact-form slice

- The isolated React preview now has a reusable, typed Web3Forms contact form with the same name, email, optional phone and message fields as the legacy form.
- Submission remains multipart `FormData` to `https://api.web3forms.com/submit` with the existing subject, sender name and `reply_to` behavior. Successful submissions reset the form and preserve the `enquiry_submitted` analytics event when `gtag` is available.
- The component adds a synchronous duplicate-submission guard, disabled controls while loading, native required/email/telephone-pattern validation, autocomplete attributes, `aria-busy`, and polite/assertive live feedback for loading, success and error states.
- The React form reads `VITE_WEB3FORMS_ACCESS_KEY`. Vite embeds `VITE_` values in public browser JavaScript, so this is public configuration rather than a secret. `.env.example` contains only a placeholder; `.env` and `.env.*` remain ignored except for the example file.
- Automated tests mock all network behavior and cover the exact payload, success, provider error, missing configuration and network failure. They never submit to Web3Forms.

### Manual Web3Forms actions required before preview publication

1. In the Web3Forms dashboard, create or select the key intended for this portfolio and restrict its allowed domains to the exact production and approved preview domains (including `ruancoetzee.co.za` and `www.ruancoetzee.co.za` as applicable).
2. Add `VITE_WEB3FORMS_ACCESS_KEY` to a local ignored `.env.local` file for development and to the hosting provider's build environment for a future approved deployment. Do not commit either value.
3. Review Web3Forms spam protection, rate limits and notification destination, then make one authorised manual submission from an allowed domain.
4. The legacy HTML still contains its previous browser-exposed key because the legacy form was required to remain unchanged. Rotate or retire that key when production switches to the verified React form.

## Verified website-listing update

- The React preview now links Nails by Wilma to its verified canonical live domain, `https://nailsbywilma.co.za/`, while retaining the original Netlify URL in `legacyPath` for parity history.
- De Brakke Guest House now links to `https://www.debrakke.co.za/`. Its description reflects the verified current implementation: a Vite-powered single-page guesthouse site with responsive accommodation content, image-led presentation, contact details and LodgingBusiness structured metadata.
- Diane White Art was added at its verified live URL, `https://dianewhiteart.co.za/`, using the approved screenshot already published by RC Digital Creations.
- @Natural Health was added at `https://www.at-naturalhealth.co.za/` after confirming an HTTP 200 response, complete public metadata and existing public promotion by RC Digital Creations. Its approved RC Digital Creations screenshot is reused remotely; no new source asset was invented or downloaded.
- RC Website Insights is deferred because no verified public case study or sanitised, client-safe content was found. No analytics, credentials or client information were added.
- C&C Wedding remains absent from public React content.
- The React footer now states its actual stack: React 19, TypeScript, Vite and dedicated CSS. It separately identifies the unchanged legacy site as using Tailwind CSS and Vanta.js, without implying that production already uses React.

## Blop 2.0 React preview slice

### Reference architecture findings

- The Nails by Wilma chatbot is a browser widget that posts to the shared server-side endpoint `https://www.rcdigitalcreations.co.za/api/chat`; the read-only project contains no provider SDK, API route, serverless function or provider credential.
- Its request contract is `{ query, context, history, botName, businessName }`. History uses Gemini-compatible `user`/`model` roles with `parts: [{ text }]`, is capped at the latest 10 entries, and successful responses return `{ text }`.
- The client retries transient failures with exponential backoff. Provider integration, secret environment variables, server-side rate limiting and hosting configuration belong to the API service and cannot be audited from the Nails by Wilma frontend repository alone.
- The reference widget supplies a curated business context rather than scraping arbitrary page content. Blop 2.0 follows that pattern with a portfolio-specific, public-only context and explicit accuracy/privacy rules.

### Portfolio implementation

- The isolated React preview now mounts a reusable Blop chat component; legacy `index.html`, `script.js`, legacy Blop and the Flask/Render backend remain unchanged.
- The responsive widget includes a labelled non-modal dialog, keyboard-accessible controls, Escape-to-close with focus restoration, starter questions, a live conversation region, bounded conversation history, loading/error states and a synchronous duplicate-request guard.
- The request service preserves the proven endpoint contract, five-attempt exponential backoff and 10-entry history limit. It adds a 20-second per-attempt timeout, validates `{ text }`, and distinguishes configuration, rate-limit, timeout, server and network failures.
- Blop's curated context is teaching-first and states that the PGCE is in progress. It covers the approved qualifications, TEFL/TESOL, Geography/GIS, RC Digital Creations and public portfolio projects without including private details or unreleased work.
- Automated tests use mocked responses only and cover payload shape, bounded history, retry timing, missing endpoint configuration, invalid responses and the PGCE/unreleased-content safeguards. No live AI request is made.

### Environment and deployment requirements

1. Set `VITE_BLOP_API_URL` to the approved public chat endpoint. This value is embedded in browser JavaScript and is not secret.
2. Keep Gemini/provider API keys exclusively on the server hosting `/api/chat`. Never place a provider key in a `VITE_` variable or this repository.
3. Before publishing the preview, the API owner must allow the exact portfolio preview/production origins, verify server-side rate limiting and request-size limits, and confirm that the endpoint accepts Blop's portfolio context and bot identity.
4. Make one authorised end-to-end test from an allowed preview origin after server configuration. The automated suite deliberately does not contact the live endpoint.
5. The shared API's backend source, provider configuration and deployment project were not present in the read-only Nails by Wilma reference, so those server-side controls remain an outstanding manual verification item.

## Blop 2.0 intelligence and live-integration review

### Curated knowledge verification

- The repository CV verifies the BA in Humanities in Geography and History, the BSc Honours in Geography and Environmental Sciences, and the professional geospatial roles listed below. Only professional facts needed by Blop were used; contact details and references in the CV were not copied into chatbot context.
- Professional GIS and Remote Sensing experience is now clearly separated from academic work: Geospatial Technician at Woolpert Africa (March-September 2022) and Lidar Specialist and Aerial Surveyor at African Consulting Surveyors (October 2022-March 2024).
- The verified public toolset includes ArcGIS, QGIS, Global Mapper, Google Earth Engine, USGS resources, LiDAR equipment, RiProcess, IGI Plan, IX Plan, GrafNav, Aero Office, MicroStation, PosPac and Metashape. The CV does not connect individual duties or named projects to either geospatial employer, so Blop is instructed not to invent them.
- The public GIS/research context is generated from the typed portfolio records, including land-cover, rainfall, river, municipal study-area, seasonal-comparison, Vaal River, Liveable Cities and honours research records. These are explicitly identified as portfolio or academic work, not employer projects.
- De Brakke Guest House, Nails by Wilma, Diane White Art and @Natural Health are generated directly from their typed public portfolio records so Blop receives the approved descriptions and current links without a second manually maintained copy.
- STADIO PGCE study during 2026, Grade 11 Geography and Grade 8 Social Sciences teaching practice, teaching interests, and TEFL/TESOL certification were approved by the portfolio owner for public-profile use but are not corroborated by the repository's 2025 CV or certificate inventory. They are stated conservatively without private school, provider, date or learner details.
- Candidate discrepancy: the CV verifies `Student Assistant` at NWU Vaal Campus from January 2020 to November 2021, which is approximately two years, but does not say `student teaching assistant` or list teaching duties. Blop therefore uses the verified title and must not present that role as teaching employment without new evidence.
- RC Digital Creations context now covers responsive sites, React/TypeScript applications, PWAs, AI integrations and related website services. Blop is prohibited from inventing client outcomes, analytics, prices, guarantees or confidential details.

### Conversation and safety behavior

- Starter questions now cover teaching and placement, qualification distinctions, professional GIS/Remote Sensing, academic GIS projects, public websites and contact. Persistent in-widget links provide direct navigation to the relevant React preview sections.
- The existing 10-entry `user`/`model` history remains part of each API request for natural follow-up questions.
- A local preflight refuses requests for credentials, private/confidential information, system instructions and embargoed work without naming or confirming any unreleased project. This runs before any API request and is backed by focused tests.

### Live API inspection and current status

- On 8 October 2026, `GET https://www.rcdigitalcreations.co.za/api/chat` returned HTTP 200 from Vercel. An invalid empty POST returned HTTP 400, confirming basic request validation.
- A portfolio-origin preflight returned HTTP 200 but `Access-Control-Allow-Origin: https://www.rcdigitalcreations.co.za/`. The endpoint currently does not authorize `https://www.ruancoetzee.co.za`, so the React preview cannot make a browser request from the portfolio domain.
- The Nails by Wilma frontend sends no authentication credential. Its repository contains only `chat-widget.js` and `chat-widget.css` for the chatbot; no API/serverless source, provider SDK, secret configuration or deployment manifest is present. The `/api/chat` path and response headers identify Vercel hosting, but the function's internal structure cannot be verified from the supplied reference.
- Provider keys appear to remain server-side because none are sent or stored by the reference browser client. Server-side authentication, provider configuration, request-size enforcement and rate limiting cannot be confirmed without access to the API project's source or Vercel configuration.
- **Live status: blocked, not verified.** No successful AI request is claimed. Automated tests remain mocked, and a real generative request was not sent because portfolio CORS is not configured.

### Exact manual setup required

1. In the Vercel project that owns `www.rcdigitalcreations.co.za/api/chat`, add the approved portfolio origins to the endpoint's CORS allowlist: `https://ruancoetzee.co.za`, `https://www.ruancoetzee.co.za`, and any exact preview origin that will be used. Preserve the existing RC Digital Creations and Nails by Wilma origins.
2. Confirm the serverless function validates `query`, `context`, Gemini-style `history`, `botName` and `businessName`; caps body/context/history sizes; and returns `{ "text": "..." }` on success with non-sensitive errors on failure.
3. Confirm a Gemini/provider API key exists only in the server-side Vercel environment. Do not add it to this repository or any `VITE_` variable.
4. Confirm server-side per-origin/IP rate limiting and abuse monitoring. CORS is a browser control, not authentication or rate limiting.
5. Keep `VITE_BLOP_API_URL=https://www.rcdigitalcreations.co.za/api/chat` in the portfolio build environment, then make one authorised browser test from the exact preview origin. Record the HTTP status and verify a non-empty `{ text }` response before calling Blop live.
6. Review the returned answer for PGCE-in-progress wording, professional-versus-academic GIS distinctions and refusal of private/unreleased requests before any deployment approval.
