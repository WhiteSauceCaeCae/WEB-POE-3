# Sweet Lips Bakery Website

A responsive, five-page website for **Sweet Lips Bakery**, a cupcake and cake shop in Cape Town. The site presents the bakery's menu, lets customers request a custom order estimate, and helps them find and contact the shop.

**Module:** Software Development, Rosebank International
**Student:** Caelyn Ntsulungo
**Live site:** <!-- TODO: paste your Netlify / GitHub Pages URL --> https://sweetlipsbakery.netlify.app
**Repository:** <!-- TODO: paste your GitHub repository URL -->

---

## Project overview

The website supports four business goals set out in Part 1: build a brand presence across Greater Cape Town, showcase an organised digital menu with dietary options, generate leads through an interactive custom-order form, and drive foot traffic with a map and opening hours.

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero banner, featured categories, gallery with lightbox, call to action |
| About | `about.html` | Story, mission and promise (tabs), goals, FAQ (accordion) |
| Menu | `menu.html` | Dynamically loaded menu with search, filter and sort |
| Custom Orders | `enquiry.html` | Enquiry form with instant cost and availability response |
| Contact | `contact.html` | Contact form that compiles an email, Leaflet map, hours |
| Not found | `404.html` | Friendly error page (excluded from search indexing) |

### Folder structure

```
sweet-lips-bakery/
├── index.html, about.html, menu.html, enquiry.html, contact.html, 404.html
├── css/style.css
├── js/        main.js, gallery.js, menu.js, validate.js, enquiry.js, contact.js, map.js
├── data/      menu.json, pricing.json, availability.json
├── images/    original SVG illustrations and favicon
├── robots.txt, sitemap.xml, _headers
└── README.md
```

### Technologies

HTML5 (semantic elements), CSS3 (custom properties, Grid, Flexbox, media queries), vanilla JavaScript (ES6+, `fetch`, `IntersectionObserver`, native `<dialog>`), Leaflet 1.9.4 with OpenStreetMap tiles, Netlify for hosting.

---

## Part 3: new functionality

### Interactive elements (brief section 2.1)

| Requirement | Implementation |
|-------------|----------------|
| Tabs | About page: Our Story / Our Mission / Our Promise (`role="tablist"`, arrow-key navigation) |
| Accordion | About page FAQ, one panel open at a time (`aria-expanded`, `aria-controls`) |
| Modal | Menu page: "View details" opens a `<dialog>` with the item's image, description and price |
| Interactive map | Contact page: Leaflet map with a marker, popup and approximate delivery-zone circle |
| Animations and transitions | CSS keyframes (`fadeUp`), hover transitions on cards, buttons and gallery items, scroll-reveal using `IntersectionObserver`; all disabled for users who prefer reduced motion |
| Advanced DOM manipulation | Menu cards are built with `createElement`, `DocumentFragment` and `replaceChildren`; event delegation is used for dynamically created buttons; user input is written with `textContent` (never `innerHTML`) |
| Gallery with lightbox | Home page: six images open in a larger view with previous/next buttons, arrow-key support, caption and focus return |

### Dynamic content (brief section 2.2)

`js/menu.js` loads the product list from `data/menu.json` using `fetch` and renders the cards. Visitors can **search** by keyword, **filter** by category and dietary need (vegan, gluten-free) and **sort** by name or price.

### Forms and validation (brief section 4)

* **`enquiry.html`** is for service and product enquiries (custom cake, cupcake boxes, event catering). After the input passes validation, `js/enquiry.js` loads `data/pricing.json` and `data/availability.json` with `fetch` and responds with an **availability** message and an itemised **cost estimate** (including flavour, dietary, short-notice and delivery extras).
* **`contact.html`** is for general messages. Visitors give basic contact details, choose a message type and type a full message. After validation, `js/contact.js` **compiles an email** (recipient, subject and body shown in a preview) and the visitor sends it with the *Send email* button to the recipient set in the code (`RECIPIENT` in `js/contact.js`). If an AJAX endpoint is set in `FORM_ENDPOINT`, the message is submitted asynchronously with `fetch` instead.
* **Validation:** HTML5 attributes (`required`, `minlength`, `maxlength`, `pattern`, `min`, `max`, `type="email|tel|date|number"`) combined with JavaScript in `js/validate.js`. Errors appear next to the field, are announced to screen readers (`role="alert"`, `aria-invalid`) and update as the user types. Phone numbers must be valid South African formats, dates cannot be in the past, and message lengths are checked.
* **Form submission:** both `<form>` elements have an `action` attribute; JavaScript intercepts the submit event so the validated data is handled asynchronously.

### Search Engine Optimisation (brief section 3)

**On-page SEO**

* **Keyword research:** target phrases are *artisanal bakery Cape Town*, *custom cakes Cape Town*, *gourmet cupcakes*, *vegan and gluten-free bakery* and *order custom cake*. They appear naturally in titles, headings, descriptions and body text.
* **Titles and meta descriptions:** every page has a unique, descriptive `<title>` and meta description. Open Graph and Twitter Card tags are included for social sharing.
* **Headings:** one `<h1>` per page, with `<h2>` and `<h3>` used in order.
* **Image optimisation:** descriptive file names (for example `layer-cake-strawberry.svg`), meaningful `alt` text, width and height attributes, and `loading="lazy"`.
* **URL structure:** short, readable file names (`menu.html`, `enquiry.html`) and a `<link rel="canonical">` on each page.
* **Internal linking:** call-to-action links between pages (for example menu to enquiry, FAQ to contact).
* **Mobile friendliness:** viewport meta tag, fluid Grid layouts and breakpoints at 62rem, 48rem and 37.5rem.
* **Structured data:** JSON-LD `Bakery` schema on the home page (name, telephone, opening hours, location).

**Off-page SEO (plan):** list the bakery on Google Business Profile with the website link; ask local Cape Town food bloggers and event planners for backlinks; link the site from the Instagram and Facebook bios; share new menu items and custom cake photos on both platforms with the site link.

**Additional requests**

* `robots.txt` allows crawling, blocks `/data/` and `404.html`, and points to the sitemap.
* `sitemap.xml` lists all five pages with priorities and last-modified dates.
* **Page speed:** deferred scripts, lightweight SVG images, `font-display: swap` through Google Fonts, preconnect hints, lazy-loaded images and cache headers.
* **Security:** `_headers` file sets a Content Security Policy, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`; Leaflet is loaded with Subresource Integrity; external links use `rel="noopener noreferrer"`; no inline scripts, inline handlers or inline styles; user input is never inserted as HTML.

### Accessibility

Skip link, visible focus outlines, semantic landmarks, ARIA roles for tabs, accordion, dialogs and live regions, keyboard-operable controls, labelled form fields, and `prefers-reduced-motion` support.

---

## Responsive testing evidence

The site was tested at desktop (1440 px), tablet (768 px) and mobile (375 px) widths using the browser developer tools device toolbar.

| Device | Width | Screenshot |
|--------|-------|-----------|
| Desktop | 1440 px | <!-- TODO: add screenshot --> `docs/screenshots/desktop.png` |
| Tablet | 768 px | <!-- TODO: add screenshot --> `docs/screenshots/tablet.png` |
| Mobile | 375 px | <!-- TODO: add screenshot --> `docs/screenshots/mobile.png` |

---

## Changelog

All dates are 2026. Entries marked **Part 2 feedback** respond directly to the lecturer's Part 2 comments.

### Part 2 feedback corrections

| # | Date | File | Change | Reason |
|---|------|------|--------|--------|
| 1 | 1 Nov | `css/style.css` | **Part 2 feedback:** corrected the invalid property `max-with` to `max-width`. | `max-with` is not a CSS property, so the browser ignored it and the width limit was never applied. |
| 2 | 1 Nov | `css/style.css` | **Part 2 feedback:** corrected the selector `herder` to `header` (now `.site-header`). | The misspelt selector matched no element, so the header styles were never applied. |
| 3 | 1 Nov | `css/style.css` | **Part 2 feedback:** removed responsive rules that had been placed inside the `:root` block. `:root` now holds custom properties only; all responsive rules live in `@media` queries in section 8 of the stylesheet. | Rules inside `:root` for layout are invalid in that context; the real media queries lower in the file were doing the work, so the misplaced rules were redundant. |
| 4 | 1 Nov | `css/style.css` | **Part 2 feedback:** cleaned up and reorganised the stylesheet into numbered sections (tokens, base, layout, components, forms, interactive, animations, responsive, accessibility) and re-tested at desktop, tablet and mobile widths. | The lecturer noted the CSS needed further testing and cleanup. |
| 5 | 1 Nov | `README.md` | **Part 2 feedback:** removed the unfinished placeholders for image and reference information and added the Images and References sections below. | The lecturer noted unfinished placeholders in the README. |
| 6 | 1 Nov | `README.md` | **Part 2 feedback:** added a responsive testing section with desktop, tablet and mobile screenshot evidence. | The Part 2 brief requires screenshot evidence at three sizes. |
| 7 | 1 Nov | `README.md` | **Part 2 feedback:** recorded the Part 1 lecturer feedback and the corrections made (see the next table). | The Part 2 brief requires Part 1 corrections to be recorded in the changelog. |

### Part 1 lecturer feedback and corrections

<!-- TODO: replace this table with your Part 1 lecturer feedback and what you changed. Keep one row per comment. -->

| Part 1 feedback | Correction made |
|-----------------|-----------------|
| *(paste the lecturer's comment here)* | *(describe the fix and the file changed)* |

### Part 3 new features

| # | Date | File(s) | Change |
|---|------|---------|--------|
| 8 | 1 Nov | `js/main.js`, `about.html` | Added accessible tabs (Our Story, Our Mission, Our Promise) and an FAQ accordion. |
| 9 | 1 Nov | `js/menu.js`, `data/menu.json`, `menu.html` | Menu now loads dynamically with `fetch`; added search, category and dietary filters, sorting and a details modal. |
| 10 | 1 Nov | `js/gallery.js`, `index.html` | Added gallery with lightbox (previous/next, keyboard support, focus return). |
| 11 | 1 Nov | `js/map.js`, `contact.html` | Added Leaflet map with marker, popup and delivery-zone circle. |
| 12 | 1 Nov | `css/style.css`, `js/main.js` | Added CSS animations and transitions and scroll-reveal with `IntersectionObserver`, respecting reduced-motion settings. |
| 13 | 1 Nov | `enquiry.html`, `js/enquiry.js`, `data/pricing.json`, `data/availability.json` | Added enquiry form with conditional fields, validation and an instant cost and availability response loaded with `fetch`. |
| 14 | 1 Nov | `contact.html`, `js/contact.js` | Added contact form that validates input and compiles an email to the recipient set in the code; optional AJAX submission. |
| 15 | 1 Nov | `js/validate.js` | Added shared validation (HTML5 constraints plus JavaScript, inline error messages, character counters). |
| 16 | 1 Nov | all `.html` files | Added unique titles, meta descriptions, canonical links, Open Graph tags, descriptive image alt text and a JSON-LD `Bakery` schema. |
| 17 | 1 Nov | `robots.txt`, `sitemap.xml` | Added crawler instructions and a sitemap. |
| 18 | 1 Nov | `_headers`, all `.html` files | Added security headers and Content Security Policy; removed inline scripts, handlers and styles; added Subresource Integrity for Leaflet. |
| 19 | 1 Nov | `404.html` | Added a custom error page excluded from indexing. |
| 20 | 1 Nov | `README.md` | Updated for Part 3: new features, SEO, testing evidence, changelog, images and references. |

---

## Images

All images in `/images` are original SVG illustrations created for this project, so no third-party photography or licences are involved. They stand in for the bakery's own product photography; replace them with real photos (keeping descriptive file names and `alt` text) when available. Map tiles are provided by OpenStreetMap contributors.

## References

Leaflet (2023) *Leaflet: an open-source JavaScript library for interactive maps*. Available at: https://leafletjs.com/ (Accessed: 1 November 2026).

OpenStreetMap Foundation (n.d.) *Copyright and license*. Available at: https://www.openstreetmap.org/copyright (Accessed: 1 November 2026).

Google (n.d.) *Google Fonts: Playfair Display and Inter*. Available at: https://fonts.google.com/ (Accessed: 1 November 2026).

Google (n.d.) *Search Engine Optimization (SEO) starter guide*. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 1 November 2026).

Mozilla (n.d.) *MDN Web Docs: HTML dialog element, Constraint validation, Fetch API, IntersectionObserver*. Available at: https://developer.mozilla.org/ (Accessed: 1 November 2026).

Sitemaps.org (n.d.) *Sitemaps XML format*. Available at: https://www.sitemaps.org/protocol.html (Accessed: 1 November 2026).

Netlify (n.d.) *Netlify Docs: custom headers and deploys*. Available at: https://docs.netlify.com/ (Accessed: 1 November 2026).

W3C (n.d.) *WAI-ARIA Authoring Practices Guide: tabs and accordion patterns*. Available at: https://www.w3.org/WAI/ARIA/apg/ (Accessed: 1 November 2026).

---

## Running locally and deploying

1. Open the folder in VS Code and use the **Live Server** extension (the menu, pricing and availability data load with `fetch`, which needs a web server and will not work when opening files directly from disk).
2. Commit with descriptive messages, for example `feat: add menu search and filter` or `fix: correct max-width typo in stylesheet`.
3. Push to GitHub, then deploy: on Netlify choose *Add new site → Import from Git* (no build command, publish directory `/`), or enable GitHub Pages from the repository settings. Note that `_headers` only works on Netlify.
4. Before submitting, update `RECIPIENT` in `js/contact.js`, the map coordinates in `js/map.js` and the site URL in `robots.txt`, `sitemap.xml` and the canonical tags if your live address differs from `sweetlipsbakery.netlify.app`.
