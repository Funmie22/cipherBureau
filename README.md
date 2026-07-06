# Cipher Bureau — Daily Detective Game

A **daily mystery game** built on **Devvit Web** for Reddit communities. Players solve cryptic cases by cracking ciphers, making accusations, and climbing the leaderboard.

**For the Reddit's Games with a Hook Hackathon (July 2026)**

---

## 🎮 Game Overview

### The Loop
1. **Read** → Daily case with clues, timeline, interviews
2. **Crack** → Cipher puzzle to unlock the accusation board
3. **Accuse** → Choose suspect, evidence, and motive
4. **Compete** → Climb the leaderboard, earn flair rewards
5. **Return** → New case tomorrow

### Key Features
- ✅ **Daily deterministic cases** — same case for all players, resets every 24h
- ✅ **Cipher unlock** — players must type decoded keyword to reveal accusations
- ✅ **Server-side validation** — solution never exposed to client
- ✅ **Community comments** — persistent discussion thread per post
- ✅ **Leaderboard** — top solvers ranked by reputation
- ✅ **Flair rewards** — automatic badges (Beat Detective, Inspector, Master Sleuth)
- ✅ **Mobile responsive** — fully playable on phones/tablets
- ✅ **Zero external APIs** — completely self-contained

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v22+ (or compatible)
- **npm** 10+
- **Devvit CLI** (global): `npm install -g devvit`
- **Reddit account** (for testing in playtest)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Build webview (React + Tailwind)
npm run build:webview

# 3. Package Devvit app
npm run ci:package
# Output: dist/cipher-bureau-devvit.zip

# 4. Launch playtest (requires auth)
npm run dev
# Opens browser to Devvit playtest environment
# Follow prompts to authenticate
```

---

## 📁 Project Structure

```
CipherBureau/
├── src/
│   └── main.tsx                    # Devvit entrypoint (Actor, message handlers)
│                                   # Manages case selection, accusations, leaderboard
├── backend/
│   ├── dailyCaseEngine.js          # Game engine (case selection, validation)
│   ├── data/dailyCases.js          # Case definitions (solution protected)
│   └── tests/dailyCaseEngine.test.js
├── webview/
│   ├── src/
│   │   ├── App.jsx                 # React wrapper
│   │   ├── components/
│   │   │   └── DailyCaseApp.jsx    # Main UI (clues, cipher, accusations, leaderboard)
│   │   ├── main.jsx                # Vite entry
│   │   └── index.css               # Tailwind + Reddit theme
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── scripts/
│   ├── prepare-devvit.cjs          # Copy files to dist/devvit-package
│   └── pack-devvit.cjs             # Create dist/cipher-bureau-devvit.zip
├── devvit.yaml                     # Devvit manifest (entrypoint, webview path)
├── package.json                    # Root dependencies + scripts
├── tsconfig.json                   # TypeScript + JSX config
└── dist/
    ├── cipher-bureau-devvit.zip    # Submission artifact
    └── devvit-package/             # Packaged app files
```

---

## 🛠️ Development Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run build:webview` | Build React app (Vite) → webview/dist/ |
| `npm run package:devvit` | Copy files to dist/devvit-package |
| `npm run pack:devvit` | Create dist/cipher-bureau-devvit.zip |
| `npm run ci:package` | Build + package in one step ✅ |
| `npm run dev` | Launch Devvit playtest (requires auth) |

---

## 🔐 Security Architecture

### Backend → Frontend Communication
- **Message-based** via `postMessage()` API (no HTTP exposure)
- **Solution never included** in case data sent to client
- **Cipher validation** happens server-side only

### Cipher Unlock
- Player types decoded keyword (e.g., "MORSE", "NORTH", "HOLLOW")
- Server checks against `case.clue.answer`
- Only on match: unlock message sent to unlock accusation board

### Accusation Validation
- Client sends `{ suspectId, evidenceId, motiveId }`
- Server compares against `case.solution` (not visible on client)
- Correct → leaderboard update + flair check
- Incorrect → feedback message only (no penalty)

### Storage
- Devvit Storage API (not localStorage, persists across sessions)
- Comments stored per post (`comments_${postId}`)
- Leaderboard stored globally (`leaderboard`)
- No external database needed

---

## 📱 Mobile Responsiveness

Built with **Tailwind CSS** responsive classes:
- **Mobile** (320px–640px): Single-column layout, stacked cards
- **Tablet** (640px–1024px): Two-column layout (case + clue sidebar)
- **Desktop** (1024px+): Full 2-column + whitespace

**Touch targets:** All buttons/inputs ≥44px (mobile-friendly)

**Tested:** Chrome DevTools device emulation, native mobile browsers

---

## 🎯 Hackathon Criteria Coverage

### "Best Experience That Will Keep People Coming Back"
- ✅ Daily case rotation (same case, all players, resets at 00:00 UTC)
- ✅ Streak system (players tracked for consecutive solves)
- ✅ Cumulative leaderboard (top solvers gain prestige)
- ✅ Flair rewards (public badges for achievement)
- ✅ Community engagement (comments create social loop)

### "Best Use of Retention Mechanics"
- ✅ Deterministic daily generation (creates FOMO: "Don't miss today's case")
- ✅ Reputation milestones (10, 60, 150 points for flair)
- ✅ Leaderboard competition (implicit multiplayer)
- ✅ Persistent comments (discussion happens asynchronously)

### "Best Use of User Contributions"
- ✅ Community comments (players share theories, hints)
- ✅ Leaderboard (celebrates top community members)
- ✅ Flair visibility (badges show achievement publicly)

### "Delightful UX & Polish"
- ✅ Reddit-dark theme (matches platform expectations)
- ✅ Smooth animations (case reveal, button feedback)
- ✅ Clear information hierarchy (clue → cipher → board → leaderboard)
- ✅ Accessibility (semantic HTML, WCAG AA contrast)
- ✅ Error handling (graceful fallbacks, user-friendly messages)

---

## 🧪 Testing

### Local Dev (without playtest)
```bash
npm run build:webview
# Open webview/dist/index.html in browser
# UI loads, local fallback for Devvit APIs
```

### Full Devvit Playtest
```bash
npm run dev
# Requires Devvit CLI auth
# Opens browser to interactive post preview
# Test case loading, cipher unlock, accusations, comments, leaderboard
```

### Test Cases
1. **Case Loading** — clues appear correctly
2. **Cipher Unlock** — typing correct answer unlocks board
3. **Accusation** — correct/incorrect selections handled properly
4. **Comments** — new comments persist and display
5. **Leaderboard** — scores update, top players ranked
6. **Flair** — reaching thresholds grants badges
7. **Mobile** — all features work on 320px viewport

---

## 📊 Technical Details

| Metric | Value |
|--------|-------|
| **Framework** | Devvit Web (React + Devvit APIs) |
| **Language** | TypeScript, JSX, JavaScript |
| **Bundler** | Vite 5.x |
| **Styling** | Tailwind CSS 3.x |
| **Bundle Size** | ~56KB gzipped (webview) |
| **Package Size** | ~63KB (ZIP) |
| **Load Time** | ~2–3 seconds |
| **Mobile** | Fully responsive ✅ |
| **Accessibility** | WCAG AA ✅ |

---

## 🚢 Deployment

### For Hackathon Submission

1. **Build production package:**
   ```bash
   npm run ci:package
   # Outputs: dist/cipher-bureau-devvit.zip (63KB)
   ```

2. **Upload to Devvit:**
   - Go to [developer.reddit.com](https://developer.reddit.com)
   - Upload `dist/cipher-bureau-devvit.zip`
   - Follow platform prompts

3. **Create demo post:**
   - Launch app on test subreddit
   - Create public post with title: "Daily Case — The Midnight Ledger"
   - Share post URL on Devpost

4. **Submit to Devpost:**
   - Upload ZIP artifact
   - Paste demo post link
   - Fill in submission details (see `APP_LISTING.md`)

---

## 📚 Documentation

- **[APP_LISTING.md](./submission/APP_LISTING.md)** — Devpost submission copy
- **[SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md)** — Pre-launch verification
- **[QUICKSTART.md](./docs/QUICKSTART.md)** — Devvit setup guide

---

## 🤝 Contributing

This is a hackathon submission. For issues or suggestions:
1. Open an issue on GitHub
2. Fork and submit a pull request
3. Contact: [your-email@example.com]

---

## 📄 License

[Your License Here] — See LICENSE file

---

## 🎉 Status

✅ **Ready for Submission**

- [x] All game mechanics implemented
- [x] Mobile responsive
- [x] Security enforced
- [x] Package created
- [x] Documentation complete
- [x] Zero external dependencies
- [x] Hackathon criteria aligned

**Launch Command:**
```bash
npm run dev  # Start Devvit playtest
```

---

**Built for:** Reddit's Games with a Hook Hackathon (July 2026)  
**Platform:** Devvit Web  
**Prize Categories:** Best App with a Hook, Best Use of Retention Mechanics, Best Use of User Contributions

```bash
npm run build:webview
```

3. Prepare the Devvit package (collects built webview and server handlers):

```bash
npm run package:devvit
```

4. The package will be available at `dist/devvit-package`. Use the Devvit CLI to upload or run locally according to Devvit docs.

Quickstart

- One-minute quickstart guide: [docs/QUICKSTART.md](docs/QUICKSTART.md)
- Run the app in playtest mode:

```bash
npm run dev
```

> Note: `npm run dev` uses `npm exec -- devvit`, so you do not need a global Devvit installation.

Packaging notes

- The `scripts/prepare-devvit.js` script collects `devvit.yaml`, `src/main.tsx`, the `backend/` folder, and the `webview/dist` build into `dist/devvit-package`.
- Flair granting and storage interactions require the Devvit runtime and proper app permissions.

License: MIT
