# Fortnite Cosmetics Vault

An interactive web application to browse, search, inspect, and experience every Fortnite cosmetic, skin, item shop rotation, live Battle Royale minimap, locker loadout builder, and cosmetic trivia quiz.

Powered by data from [Fortnite-API.com](https://fortnite-api.com).

---

## Features

- **Cosmetic Vault**: Explore and search all Fortnite skins, pickaxes, gliders, emotes, backpacks, wraps, and music packs with rarity effects, 3D style variants, and audio previews.
- **Live Item Shop**: Real-time rotating Item Shop with countdown timer, v-Buck calculations, and category filters.
- **Locker Loadout Builder**: Craft dream loadouts and export high-resolution PNG loadout cards directly from your browser.
- **Island Minimap Explorer**: High-resolution Fortnite Chapter map viewer with zoom controls, POI markers, and coordinate inspections.
- **Cosmetic Quiz Mini-Game**: Interactive cosmetic trivia challenge to test your Fortnite knowledge with instant score tracking and sound effects.

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

The compiled assets will be in the `dist/` directory, ready to deploy to any static host or CDN.

---

## Deploying to GitHub Pages

This repository is pre-configured with a GitHub Actions workflow in `.github/workflows/deploy.yml` and relative Vite base paths (`base: './'`).

### One-Time Setup in GitHub:
1. Go to your GitHub repository.
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push your commits to `main` (or `master`).
5. GitHub will automatically run the deployment workflow and publish your site at:
   `https://<your-username>.github.io/<your-repo-name>/`

---

## Tech Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide Icons**
- **HTML5 Canvas & Web Audio API**
- **Fortnite-API.com REST API**
