# 📝 DEVPOST SUBMISSION FORM — FILL-IN GUIDE

## Submission URL
https://redditgameswithahook.devpost.com/

---

## 🎯 Form Fields (Copy-Paste Ready)

### Field 1: Project Title
```
Cipher Bureau — Daily Detective Ritual
```

### Field 2: Tagline / Short Description
```
A daily mystery game that hooks players with cryptic cases, community competition, and flair rewards.
```

### Field 3: Project Description / Long Description

Copy from **[APP_LISTING.md](./submission/APP_LISTING.md)** — Executive Summary section:

```
CIPHER BUREAU is a daily detective game built for Reddit communities. Players solve a new mystery every day by:
1. Reading clues (timeline, interviews, evidence)
2. Cracking a cipher to unlock the accusation board
3. Making accusations (suspect, evidence, motive)
4. Competing on a leaderboard and earning flair rewards

The app is fully mobile-responsive, community-driven, and designed to create a daily return loop that keeps players coming back.

HACKATHON ALIGNMENT:
✅ Daily/recurring content — same case for all players, resets every 24h
✅ Flair rewards — players earn badges for solving (Beat Detective, Inspector, Master Sleuth)
✅ Community leaderboard — see top solvers, create friendly competition
✅ Persistent comments — community discussion builds anticipation for next day's case
✅ Streak tracking — players are incentivized to return daily to maintain streaks
```

### Field 4: "How It Works" / Technical Details

Copy from **[APP_LISTING.md](./submission/APP_LISTING.md)** — Technical Implementation section:

```
DEVVIT ARCHITECTURE:
- Entrypoint: src/main.tsx (Devvit Actor with message handlers)
- Webview: React 18.x component with Tailwind CSS
- Backend Logic: Pure JavaScript game engine (backend/dailyCaseEngine.js)
- Persistence: Devvit Storage API (comments, leaderboard)
- Social: Devvit Flair API (automatic badge assignment)

SECURITY:
- Solution never exposed to client — validation happens server-side
- Cipher unlock enforced — players must type decoded keyword to reveal board
- Message-based communication — postMessage API prevents HTTP eavesdropping

MOBILE RESPONSIVENESS:
- Tailwind responsive classes (sm:, md:, max-w-3xl)
- Touch-friendly buttons (min 44px hit targets)
- Vertical scrolling layout (optimized for phone)
- Readable font sizes (base 16px, scales properly)

GAME MECHANICS:
Daily case is deterministic based on ISO date (YYYY-MM-DD)
All players see the same case on the same day
Case rotates at 00:00 UTC

Cipher Unlock:
- Players read the clue prompt
- They must decode the cipher and type the keyword (e.g., "MORSE", "NORTH", "HOLLOW")
- Only after correct unlock can they access the accusation board

Accusation Submission:
- Players choose: Suspect, Evidence, Motive
- Server validates against the solution (not visible on client)
- Correct accusation = +10 reputation, appear on leaderboard, potentially earn flair
- Incorrect = feedback message, no penalty, try again

Leaderboard & Flair:
Reputation thresholds unlock flair:
  10+ points → "Beat Detective" flair
  60+ points → "Inspector" flair
  150+ points → "Master Sleuth" flair
Flair is applied via Devvit flair API (persistent community recognition)

Community Engagement:
- Comments persist per post
- Players share theories, clues, hints
- Leaderboard highlights top solvers by day/all-time
```

### Field 5: What You Learned / Development Process

```
Built a fully functional daily game within Devvit Web constraints:

1. ARCHITECTURE: Evolved from Express HTTP to Devvit's message-based communication model for better security
2. SECURITY: Implemented server-side solution validation to prevent client-side cheating
3. STATE MANAGEMENT: Used Devvit Storage API instead of external databases for persistence
4. SOCIAL: Leveraged Devvit flair API for community recognition and player progression
5. DESIGN: Optimized for mobile-first Reddit experience with dark theme and touch-friendly UI
6. TESTING: Validated all game mechanics, leaderboard logic, and community features end-to-end

Key challenge: Ensuring solution stays secret while providing rich accusation feedback — solved via server-side validation.
Key success: Daily deterministic case generation creates natural return loop without artificial timers.
```

### Field 6: Inspiration / Why You Built This

```
Inspired by Reddit's most engaging communities (r/DailyGuess, r/honk, r/ColorPuzzleGame) that thrive on daily rituals and community participation.

Cipher Bureau combines:
- The mystery hook of detective games (Wordle-like intrigue)
- The daily reset of games like Wordle and Connections (FOMO + streaks)
- The social elements of Reddit (comments, leaderboard, flair)
- The retention mechanics that make subreddits sticky (return incentive)

Goal: Build a game that's fun to play once but irresistible to play every day.
```

### Field 7: Built With / Technologies

```
Frontend:
- React 18.x
- Tailwind CSS 3.x
- Vite 5.x (bundler)
- Lucide React (icons)

Backend:
- Devvit Web Platform
- TypeScript (type safety)
- Devvit Storage API (persistence)
- Devvit Flair API (social rewards)

Game Logic:
- Pure JavaScript (no dependencies)
- Deterministic daily case selection
- Server-side solution validation

Deployment:
- Devvit (Reddit's developer platform)
- Interactive Posts feature
- Message-based webview communication
```

### Field 8: Demo Post URL

**After running `npm run dev`**, you'll get a demo post URL. Paste it here:

```
https://reddit.com/r/YOUR_SUBREDDIT/comments/[POST_ID]/daily_case_the_midnight_ledger
```

**How to get it:**
```bash
npm run dev
# Watch for browser to open
# Copy URL from address bar
# It will be a Reddit post with your game running as interactive post
```

### Field 9: App Link (Optional)

If you've uploaded to developer.reddit.com:
```
https://developers.reddit.com/apps/[APP_ID]
```

### Field 10: GitHub Repository (Recommended)

```
https://github.com/[YOUR_USERNAME]/CipherBureau
```

Or specify that it's private/in submission.

### Field 11: Additional Links (Optional)

- Documentation: `[link-to-repo]/blob/main/README.md`
- Setup Guide: `[link-to-repo]/blob/main/docs/QUICKSTART.md`

### Field 12: Video Demo URL (Optional but Recommended)

If you record a demo video:
```
https://youtube.com/watch?v=[VIDEO_ID]
or
https://streamable.com/[VIDEO_ID]
```

**What to show (30–60 seconds):**
1. Case loading (clues display)
2. Cipher unlock (type keyword)
3. Accusation board (make choice)
4. Results (correct/incorrect feedback)
5. Leaderboard update (score added)
6. Mobile view (responsive design)

---

## 📸 Screenshots (Recommended)

Upload 3–5 screenshots:

1. **Case Reveal View**
   - Clue prompt, timeline, interviews
   - Shows information architecture

2. **Cipher Unlock**
   - Shows the cipher input form
   - Demonstrates unique mechanic

3. **Accusation Board**
   - Three accusation choices
   - Shows main decision point

4. **Leaderboard**
   - Top solvers display
   - Demonstrates retention/social aspect

5. **Mobile View**
   - Screenshot on phone (responsive design)
   - Shows mobile-first optimization

**Pro tip:** Use Chrome DevTools to take screenshots at 375px width (iPhone SE) and 1024px width (tablet).

---

## ✅ Final Submission Checklist

Before clicking "Submit Project":

- [ ] **Title** filled: "Cipher Bureau — Daily Detective Ritual"
- [ ] **Tagline** filled (short description)
- [ ] **Long description** copied and pasted
- [ ] **How it works** section filled (technical details)
- [ ] **What you learned** section filled
- [ ] **Inspiration** section filled
- [ ] **Built with** technologies listed
- [ ] **Demo post URL** pasted (from `npm run dev`)
- [ ] **Screenshots** uploaded (3–5 images)
- [ ] **Video demo** uploaded (optional but recommended)
- [ ] **GitHub repo** linked (optional)
- [ ] **All form fields** complete
- [ ] **No spelling errors** (check description)
- [ ] **Hackathon rules** accepted
- [ ] **Account verified** (Devpost email confirmed)

---

## 🎁 Optional: Developer Feedback Form

After submission, complete this form for bonus entry:
https://forms.gle/YByxxCneDsn174qb9

It helps Devvit platform improve, and you get extra prize eligibility.

---

## 🚀 SUBMISSION COMMANDS

```bash
# 1. Ensure package is built
npm run ci:package
# Output: dist/cipher-bureau-devvit.zip ✅

# 2. Launch demo (get URL for Devpost)
npm run dev
# Copy demo post URL

# 3. Go to Devpost and fill form above
# 4. Submit!

# 5. (Optional) Complete feedback survey
# https://forms.gle/YByxxCneDsn174qb9
```

---

## 🎯 Judging Criteria Reminder

Make sure your submission highlights:

1. **Hook-y** — Daily ritual, streak system, FOMO
2. **Retention** — Leaderboard, flair rewards, comments loop
3. **User Contributions** — Comments, leaderboard, flair visibility
4. **Delightful UX** — Dark theme, smooth animations, clear hierarchy
5. **Polish** — Mobile responsive, no errors, launch-ready
6. **Reddit-y** — Community features, flair, comments (not Reddit-themed)

**Your app excels at:** Retention Mechanics (3k), User Contributions (3k), Best App with Hook potential (15k)

---

**Ready to submit? Go to:** https://redditgameswithahook.devpost.com/

**Good luck! 🚀**
