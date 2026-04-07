# Strickland Surface Preparation — Website

Professional website for SSP, a mobile abrasive blasting company based in Hall County, GA.

## Structure

```
ssp-website/
├── index.html                    # Homepage
├── services.html                 # Services overview
├── about.html                    # About page
├── contact.html                  # Contact / quote form
├── gallery.html                  # Project gallery (placeholder)
├── areas.html                    # Areas served
├── thank-you.html                # Form submission confirmation
├── css/
│   └── styles.css                # Main stylesheet
├── js/
│   └── main.js                   # Navigation, scroll animations, form
├── images/
│   └── favicon.svg               # SVG favicon
└── services/
    ├── mobile-abrasive-blasting.html
    ├── rust-removal.html
    ├── paint-coating-removal.html
    ├── concrete-surface-preparation.html
    ├── striping-removal.html
    └── heavy-equipment-cleaning.html
```

## Deployment

Static HTML — deploy to Vercel, Netlify, or any static host.

For Vercel: push to GitHub repo, connect to Vercel, deploy. No build step needed.

## TODO

- [ ] Replace placeholder logo SVG with real SSP logo from ad
- [ ] Add real project photos to gallery
- [ ] Connect contact form to backend (Supabase, Formspree, etc.)
- [ ] Add Google Analytics / Tag Manager
- [ ] Set up Google Business Profile
- [ ] Add schema.org structured data (LocalBusiness, Service)
- [ ] Create city-specific location pages for SEO
- [ ] Add blog section for content marketing
- [ ] Add testimonials/reviews section
- [ ] Optimize images (WebP, lazy loading)

## Color Scheme

- Black: `#050505`
- Dark: `#0a0a0a`
- Orange: `#f47920`
- Orange Light: `#f6b828`
- Silver: `#c8c8c8`

## Fonts

- Headings: Oswald (Google Fonts)
- Body: Barlow (Google Fonts)
- Labels: Barlow Condensed (Google Fonts)
