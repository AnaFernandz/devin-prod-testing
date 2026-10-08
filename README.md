# devin-prod-testing

A small static page: plain HTML, CSS, and JavaScript with no build step.

## Features

- Responsive layout (hero, feature cards, about, contact form)
- Light/dark theme toggle that remembers your choice in `localStorage`
- Client-side contact form validation (no backend; submissions are not sent anywhere)

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

Works on any static host. For GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.
