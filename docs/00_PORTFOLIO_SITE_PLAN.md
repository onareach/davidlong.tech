# 00_PORTFOLIO_SITE_PLAN.md

## Project goal

Build a simple professional portfolio website for `davidlong.tech` as a first-draft digital teaching portfolio assignment.

The site should be intentionally simple and easy to review. It should have a top navigation with three tabs/pages:

1. About
2. Teaching Philosophy
3. Teaching with Technology Example

This is a first draft for instructor feedback, not a final polished portfolio. The design should be clean, readable, and professional, with good typography and simple navigation.

---

## Core requirements

### Site purpose
The site is meant to satisfy a course assignment requiring:
- an About section
- a teaching philosophy section
- one example of teaching with technology implementation

### Content model
Use the draft content provided in this project folder as the initial copy for each page.

### Navigation
Provide a persistent top navigation with links to:
- About
- Teaching Philosophy
- Teaching with Technology Example

Also support inline cross-links between the pages where appropriate.

### Technical preference
Use a workflow that is easy to maintain:
- local project folder on laptop
- git repo
- GitHub repo
- Vercel deployment
- custom domain `davidlong.tech`

---

## Recommended stack

Build this as a **Next.js** site using:
- Next.js App Router
- TypeScript
- simple CSS or Tailwind
- Vercel deployment

If Tailwind is used, keep the styling restrained and professional. Do not overdesign the site.

---

## Design goals

The design should feel:
- clear
- calm
- professional
- personal but not flashy

Avoid:
- gimmicky animations
- excessive gradients
- startup-style marketing language
- jargon-heavy labels
- cluttered layouts

Prefer:
- readable line lengths
- generous spacing
- simple header/nav
- strong typography hierarchy
- obvious page titles
- clean internal links

---

## Suggested routes

Create these pages:

- `/` → redirect to `/about` or render About as homepage
- `/about`
- `/philosophy`
- `/implementation`

Optional:
- `/lingua-formula` placeholder page or external link handling if needed later

---

## Suggested components

### Global layout
- site header
- top navigation
- page container
- footer with simple copyright / site note

### Shared UI
- `PageHeader`
- `SiteNav`
- `ContentContainer`
- `CrossLinkList` or just inline text links
- `ArtifactPlaceholder` component for screenshots/video placeholders

### Optional enhancements
- active nav highlighting
- mobile-friendly nav
- simple callout box for artifacts
- section anchor links within long pages

---

## Content files

Create a content folder or simply hardcode the first draft copy into the pages.

If content is separated, suggested structure:

- `content/about.md`
- `content/philosophy.md`
- `content/implementation.md`

Or create TypeScript content modules if that is simpler.

---

## Multimedia artifact handling

For the first draft, include placeholder artifact blocks on the Implementation page so the site looks assignment-ready even before final screenshots or video are added.

Examples:
- “Screenshot placeholder: Lingua Formula main study page”
- “Screenshot placeholder: exam-sheet print view”
- “Optional short demo video placeholder”

Use a styled bordered box for each placeholder.

Later, these placeholders can be replaced by:
- actual PNG/JPG screenshots
- embedded MP4 or Loom/Vercel Blob video if desired

---

## Cross-linking requirements

Each page should link naturally to the other relevant pages:

### About page
Link to:
- Teaching Philosophy
- Teaching with Technology Example

### Teaching Philosophy page
Link to:
- About
- Teaching with Technology Example

### Teaching with Technology Example page
Link to:
- About
- Teaching Philosophy

Use normal inline text links, not heavy button clutter.

---

## Tone requirements

The copy should sound:
- thoughtful
- plainspoken
- intellectually serious
- not buzzword-heavy
- not over-formal
- not corporate
- not “edtech startup” flavored

---

## Implementation steps for Cursor

1. Initialize a new Next.js project with TypeScript.
2. Set up basic page routing for the three tabs/pages.
3. Create a clean global layout with header/nav/footer.
4. Add the supplied content to the three pages.
5. Make the pages responsive and readable on desktop and mobile.
6. Add placeholder artifact boxes to the implementation page.
7. Initialize git in the project.
8. Create a `.gitignore` appropriate for Next.js.
9. Make an initial commit.
10. Link the project to a GitHub repository.
11. Push the code to GitHub.
12. Prepare for Vercel deployment.
13. Add any required metadata:
   - site title
   - page titles
   - description
14. Keep the code simple and well organized.

---

## Suggested file structure

\`\`\`
portfolio-site/
  00_PORTFOLIO_SITE_PLAN.md
  content/
    about.md
    philosophy.md
    implementation.md
  app/
    about/page.tsx
    philosophy/page.tsx
    implementation/page.tsx
    page.tsx
    layout.tsx
    globals.css
  components/
    SiteNav.tsx
    PageHeader.tsx
    ArtifactPlaceholder.tsx
    Footer.tsx
\`\`\`

---

## Domain connection plan

Primary domain:
- `davidlong.tech`

Deployment target:
- Vercel

Registrar:
- GoDaddy

### High-level deployment steps
1. Push repo to GitHub.
2. Import repo into Vercel.
3. Deploy site.
4. In Vercel, add custom domain `davidlong.tech`.
5. In GoDaddy DNS settings, add the required DNS records that Vercel provides.
6. Verify that the domain resolves correctly.
7. Confirm HTTPS works.
8. Confirm that all three routes load correctly:
   - `/about`
   - `/philosophy`
   - `/implementation`

---

## Nice-to-have improvements after initial draft

These are optional and should not block the first version:

- add a small home/landing header
- add a professional headshot or portrait if desired
- add real screenshots from Lingua Formula
- add a short demo video
- add a fourth page later for contact / CV / projects
- add a better footer
- improve SEO metadata
- add Open Graph image
- add markdown content loading if content editing becomes frequent

---

## Priority instruction

The priority is to get a simple, working, readable first draft online quickly. Favor clarity and completion over sophistication.