# MD Abul Kalam Sakib — Portfolio

**Live:** <https://iam-sourov.github.io/sakib-portfolio/>

A fast, fully responsive portfolio site for a WordPress designer, developer and SEO
expert. Built with plain HTML, CSS and JavaScript — no build step, no framework,
no dependencies — so it runs directly on GitHub Pages.

## Files

```
index.html            All sections (hero, about, services, process, work, skills, contact)
assets/css/style.css  Theme, layout, animations, responsive rules
assets/js/main.js     Scroll reveals, nav, headline rotator, tilt, form, back-to-top
assets/img/           Project preview artwork + favicon (SVG)
.nojekyll             Tells GitHub Pages to serve files as-is
```

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Host on GitHub Pages

1. Create a new repository on GitHub (e.g. `portfolio`).
2. From this folder:

   ```bash
   git init
   git add .
   git commit -m "Add portfolio website"
   git branch -M main
   git remote add origin https://github.com/USERNAME/portfolio.git
   git push -u origin main
   ```

3. In the repository: **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`, then **Save**.
5. The site goes live at `https://USERNAME.github.io/portfolio/` within a minute or two.

### Custom domain (mdsakibdm.com)

In **Settings → Pages → Custom domain**, enter `mdsakibdm.com` and save. GitHub
creates a `CNAME` file in the repo. At your domain registrar, point the DNS records
to GitHub Pages:

- `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `CNAME` record for `www` → `USERNAME.github.io`

Enable **Enforce HTTPS** once the certificate is issued.

## Editing content

- Text, links and sections live in `index.html`; the tags are commented per section.
- Colours, spacing and fonts are CSS variables at the top of `assets/css/style.css`.
- Contact details appear in the contact section, footer and the form handler in
  `assets/js/main.js` (`mailto:` address).

## Contact form

The form validates input and opens the visitor's email app with the message
pre-filled — no backend or API key required. To collect submissions instead, swap
the `window.location.href = href` line in `assets/js/main.js` for a `fetch()` call
to a form service such as Formspree or Web3Forms.

## Accessibility & performance

- Semantic landmarks, skip link, visible focus states, labelled form fields.
- Respects `prefers-reduced-motion` (animations disabled, content always visible).
- No external JavaScript libraries; fonts load from Google Fonts with system fallbacks.
