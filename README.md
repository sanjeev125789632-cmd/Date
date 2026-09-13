# Date Airport

An interactive, airport-themed date invitation. Visitors move through arrival, a playful security check, check-in, a boarding pass, the gate, an aircraft reveal, the cabin, and a takeoff finale. The experience uses animated transitions, canvas effects, optional sound, and confetti.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (the development server is configured for port 5173).

To create and inspect a production build:

```bash
npm run build
npm run preview
```

The build output is written to `dist/`. This is a client-side site and can be deployed to a static host that serves the Vite build output.

## Experience

The journey begins at **Date Airport** and advances through ten scenes. Choices at security, check-in, the aircraft, and the cabin drive the story forward; some alternative buttons offer playful responses. The visitor receives a visual boarding pass, sees the aircraft, enters the cabin, and reaches a celebratory finale. Airport sound is optional and can be enabled with the on-page toggle.

## Built with

- Vite and vanilla JavaScript
- GSAP for scene and interface animations
- Canvas API for atmospheric background effects
- `canvas-confetti` for the finale

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Scene markup and page entry point |
| `src/main.js` | Initializes the experience and sound toggle |
| `src/scenes.js` | Scene progression and interactions |
| `src/canvasFx.js` | Canvas atmosphere and visual effects |
| `src/audio.js` | Audio cues and mute control |
| `src/style.css` | Layout, styling, and responsive presentation |
| `public/assets/` | Assets served by Vite |
| `A380_Aligned_Engines_Aircraft.png` | Aircraft image in the repository root |

## Customization

Edit the invitations, flight details, and boarding pass text in `index.html` and `src/scenes.js`. Update the design in `src/style.css`, and replace referenced images under `public/assets/` as needed. Check asset paths in the markup and styles after replacing files.

This is a fictional invitation experience; its boarding pass and airport access screens are part of the story.
