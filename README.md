# Halloween Memory Game

A classic card-matching game designed to test and improve your short-term memory. Built from scratch with pure JavaScript and modern CSS/SCSS as part of the **RS School Full-Stack JavaScript 2026 Q3** course.

## 🎃 Features

- **Pure DOM Generation:** The entire user interface is dynamically built via JavaScript (`document.createElement`). The initial HTML contains only a `<script>` tag.
- **Robust State Machine:** Game logic is strictly controlled by five deterministic states (`IDLE`, `FIRST_SELECTED`, `SECOND_SELECTED`, `LOCK`, `GAME_OVER`), preventing click spamming and race conditions.
- **Performant UI Updates:** Card flipping and mismatch handling avoid full board re-renders, ensuring smooth 3D CSS transition animations.
- **Native Modals:** Built using the modern HTML5 `<dialog>` element with custom styles, automated background focus locking, and escape-key handling.
- **Persistent Leaderboard:** Stores the top 10 best games (sorted by fewer moves, then by earliest date) in `localStorage`.
- **Fully Responsive Layout:** Utilizes CSS `clamp()` and height-based constraints (`vh`) to guarantee a scroll-free layout across mobile devices, laptops, and large screens.

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/talestris/memory-game
   ```
2. Navigate to the project directory:
   ```bash
   cd YOUR_REPO_NAME
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Local Development

To spin up a local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:3000`).

### Production Build

To bundle the application and optimize assets for deployment:
```bash
npm run build
```
The compiled, deployable production files will be generated in the `dist/` directory.

## 🛠️ Tech Stack & Architecture

- **Core:** Vanilla JavaScript (ES6+), HTML5, SCSS.
- **Bundler:** Vite.
- **Utility Modules:**
  - `dom.js` – Custom functional wrapper for declarative, safe DOM element creation.
  - `gameapp.js` – Centralized game loop, match checking, and state manager.
  - `modal.js` – Reusable component logic for native `<dialog>` handling.
  - `storage.js` – LocalStorage manager for filtering and sorting leaderboard entries.