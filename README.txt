# Celebrity Exchange

A fantasy stock market game where you buy and sell celebrity shares based on media buzz. Prices update every 60 seconds with simulated news events driving volatility.

## Getting Started Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

### Option 1 — Vercel CLI (fastest)

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. From this project folder, run:
   ```bash
   vercel
   ```

3. Follow the prompts — accept all defaults. Vercel auto-detects Vite.

4. Your app will be live at a `*.vercel.app` URL instantly.

### Option 2 — GitHub + Vercel Dashboard

1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/celebrity-exchange.git
   git push -u origin main
   ```

2. Go to https://vercel.com/new

3. Import your GitHub repo

4. Vercel will auto-detect it as a Vite project. Click **Deploy**.

5. Done — live in ~30 seconds.

### Option 3 — Drag & Drop

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to https://vercel.com/new

3. Drag the `dist/` folder onto the Vercel dashboard.

## Project Structure

```
src/
  data.js          — Celebrity data, market logic, helpers
  App.jsx          — Main app shell, state management
  index.css        — Global styles & CSS variables
  components/
    Ticker.jsx     — Scrolling price ticker bar
    CelebCard.jsx  — Individual celebrity trading card
    Sparkline.jsx  — SVG mini price chart
    Portfolio.jsx  — Holdings & P&L view
    NewsFeed.jsx   — Buzz/news event feed
    Toast.jsx      — Trade confirmation toasts
```

## Customisation

- **Add celebrities** — edit the `CELEBRITIES` array in `src/data.js`
- **Change update speed** — edit `UPDATE_INTERVAL` in `src/data.js` (seconds)
- **Add news headlines** — edit `NEWS_TEMPLATES` in `src/data.js`
- **Starting cash** — edit `STARTING_CASH` in `src/data.js`
- **Colours & fonts** — edit CSS variables in `src/index.css`
