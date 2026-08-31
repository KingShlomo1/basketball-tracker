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
- **Drill Library** — ⚡ *Dribble Sprint* (most real dribbles in 60 s),
  💦 *Splash Five* (race the clock to 5 makes) and 🔥 *Hot Hand* (keep making
  shots until you miss), each with a difficulty badge, category tags and a live
  **circular progress ring** with rotating coaching cues. 3-2-1 countdowns, a
  **voice announcer**, personal **records** saved on-device, and a shareable card.
- **Score & multiplier** — every real dribble and bucket scores points, with
  **+N popups** that float off the ball and a live **multiplier** that rides your
  dribble streak. Top score is saved.
- **Weekly shots goal** — set a shots-per-week target and track progress toward
  it; it carries across sessions and resets each Monday.
- **Your Stats** — an all-time analytics screen: workouts, make %, total
  makes/shots, dribbles and time on court, a **points-per-session trend** line and
  a **make/miss donut**.
- **Shooting strip** — live *make · miss · release angle · shot time · accuracy*
  along the bottom (angle and time estimated from the tracked shot arc), plus a
  **make/miss shot-chart minimap**.
- **Extras** — shot **arc traces** (green = make, red = miss), miss feedback
  ("off left / off right / rimmed out"), **crossover counting**, real-world
  **ball speed in km/h** (scaled off the ball's known size), an NBA-Jam-style
  **on-fire mode** at 10+ and 20+ dribble streaks, live event ticker, and
  haptic buzzes on phones.

Everything runs on-device. No video is uploaded anywhere — unless you turn on
**Ball AI** (below), which is off by default.

## 🧠 Ball AI — a silent Gemini referee (optional)

The make/miss and dribble counters run on fast geometric heuristics, which can
occasionally misfire — a swish the ball detector clips as a miss, or a rattle-out
it flukes as a make. **Ball AI** adds an optional second opinion: when you take a
shot, a short burst of frames from that moment is sent to Google's **Gemini** to
confirm whether the ball actually went through the rim, and it silently corrects
the count when it disagrees (a small 🧠 badge is the only thing it says out loud).

- **Off by default.** It only ever touches the network once you paste a key and
  switch it on, so the on-device promise holds for everyone else.
- **Free.** It uses Google AI Studio's free tier and calls Gemini **once per
  shot** (never streams the feed), which stays inside the free rate limits. Grab
  a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
- **Set it up** under **Modes → Ball AI referee**: paste the key, flip the toggle.
- **Privacy:** when it's on, still frames of your *shots* leave your device and go
  to Google to be verified. Dribbles, pose and everything else stay on-device.
  Your key is stored only in your browser (`localStorage`).

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
