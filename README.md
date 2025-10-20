# My-Portfolio

A modern, responsive personal portfolio. The homepage features a clean tech theme, a sticky navbar, hero section, and sections for Projects, Resume, and Contact.

## Structure
- `PlacidoG.github.io/html practice/Home.html` — main landing page
- `PlacidoG.github.io/html practice/Company info/Main_styles.css` — global styles
- `PlacidoG.github.io/html practice/Homepage.js` — interactivity (mobile menu, active links)

## Quick start
Open the home page directly in your browser:

1. Navigate to the `PlacidoG.github.io/html practice` folder.
2. Open `Home.html` in your browser (double-click or drag into a tab).

Optional: If you use a local server, any static server will work.

## Customize
- Update Projects cards in the Projects section of `Home.html`.
- Add your resume PDF link in the Resume section.
- Replace contact details (email, LinkedIn, GitHub) in the Contact section.

### Data-driven Projects
- Edit `PlacidoG.github.io/html practice/projects.json` to add or remove items.
- If `projects.json` cannot be loaded (CORS/file URL), the inline fallback in `Home.html` will render.

Fields per item: `title`, `description`, `demo` (URL or file), `source` (URL), `tags` (array of strings).

### Contact Form
- The form uses a configurable endpoint via `data-endpoint` on the form tag.
- Create a Formspree endpoint and set it in `Home.html` (e.g., `data-endpoint="https://formspree.io/f/abcd1234"`).
- If not set, submission falls back to opening your email client via `mailto:`.

### Theme Toggle
- Click the moon/sun button in the navbar to switch between dark and light themes.
- Preference persists via `localStorage` and respects OS preference on first visit.

## Notes
- The navbar adjusts for mobile with a hamburger toggle.
- Smooth scrolling and active link highlighting are enabled.
