# Interactive Rating

The [Frontend Mentor interactive rating component](https://www.frontendmentor.io/challenges/interactive-rating-component-koxpeBUmI), built with Next.js 16.3.6, React 19.2.8, TypeScript 5.9.3 and Tailwind 4.2.1 on Node 24.

Live: https://interactive-rating.royeradames.com/

- Choose 1 to 5 with the native radio buttons (arrow keys work), submit, see the thank-you state, and restart. Submitting with no rating shows an error and moves focus to the first option.
- Ratings stay in memory and are never sent or stored. Without scripts, the page says so and submits nothing.
- The card follows the Figma desktop (1440), tablet (768) and mobile (375) frames. As in the Figma Selected and Active states, a selected rating is white and a hovered one is orange. The official designs are in `reference/design/`.
- Text is at least 16 px, so the design's 14 and 15 px text is raised to 16 px.
- `og:site_name` and WebSite JSON-LD name the site "Interactive Rating"; a 1200 x 630 Open Graph image is generated at build time.

## Development

```bash
npm ci
npm run lint && npm run typecheck && npm run build
npm test   # Playwright: journeys, design frames, 320-1600 px sweep in both states, no-JS
```
