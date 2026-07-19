# 🏀 CourtVision — AI Basketball Tracker

Point your phone's camera at the court and hoop. CourtVision runs entirely in the
browser and tracks, live:

- **Your body** — a neon stick-figure skeleton (33 joints, MediaPipe Pose)
- **The ball** — detected every frame with a glowing lock-on ring and comet trail
- **The hoop** — pin the rim once (or use auto-find); it's remembered for next time
- **Dribbles** — counted by a bounce state machine: the ball has to actually drop
  below your hips, hit the floor and spring back up. Hand waves and ball fakes
  don't count. Streaks, tempo sparkline, dribbles-per-minute and
  left-hand / right-hand splits included.
- **Buckets** — when the ball passes down through the pinned rim: counter,
  particle burst, swish sound, and a slow-mo **instant replay**. Rim-area misses
  are tracked too, so you get **attempts and shooting accuracy %**.
- **Game modes** — ⚡ *Dribble Sprint* (most real dribbles in 60 s) and
  💦 *Splash Five* (race the clock to 5 makes), with 3-2-1 countdowns, a
  **voice announcer**, personal **records** saved on-device, and a shareable
  session stat card.

Everything runs on-device. No video is uploaded anywhere.

## Files

| File | What it is |
|---|---|
| `index.html` | Cinematic scroll-animated landing page |
| `app.html` | The tracker itself |

Both are single self-contained files — no build step, no install. The AI models
load from Google's MediaPipe CDN on first launch.

## How to run it

The camera API requires **HTTPS** (or localhost), so the easiest permanent home
is **GitHub Pages**:

1. On GitHub open **Settings → Pages**
2. Under *Build and deployment*, pick **Deploy from a branch**
3. Choose the branch this code is on (and `/ (root)`), hit **Save**
4. After a minute your app is live at
   `https://<your-username>.github.io/basketball-tracker/` — open it on your
   phone and tap **Start Tracking**

For local testing: `python3 -m http.server` in this folder, then open
`http://localhost:8000`.

## Tips for good tracking

- Prop the phone up so it can see you **and** the floor where the ball bounces
- Good light matters — the ball detector struggles in the dark
- Tap **HOOP**, drag the glowing rim over the real one, tap **Done** to arm
  shot counting
