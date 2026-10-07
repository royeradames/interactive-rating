# Interactive Rating

A local Frontend Mentor rating exercise built with Next.js 16, React 19, TypeScript and Tailwind 4.

Use the native radio buttons to choose 1–5, submit, and restart. Keyboard arrows, error announcements and focus restoration are supported. Ratings stay in memory and are never transmitted or stored. Without scripts, the page explains the limitation and performs no native submission.

The supplied challenge art is retained. Body text has a 16px floor, controls have visible focus, and the project uses an original star icon.

## Development

Run `npm ci`, `npm run build`, and `npm start`. Run `npm test` with Google Chrome installed for the production-browser checks.

## Verification

Mac2 build, lint, TypeScript and production dependency audit pass. All eight browser checks pass, covering each rating, keyboard selection, restart focus, seven widths and scripts-disabled behavior. The initial and thank-you mobile views were visually inspected.

PR Preview, Lighthouse and production verification are tracked separately before release.

[Official brief](https://www.frontendmentor.io/challenges/interactive-rating-component-koxpeBUmI)
