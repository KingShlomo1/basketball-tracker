# Forge ⚡ — build your body

An **offline-first** fitness & health app (installable PWA). No account, no server, no tracking — everything lives on your device.

<p align="center"><img src="icons/icon-512.png" width="140" alt="Forge icon"></p>

## What it does

- **Today** — activity rings (workouts / active minutes / water), streak, today's workout, quick actions, weekly chart.
- **Train** — 8 follow-along, no-equipment workouts with a built-in **interval timer** (work/rest, rounds, audio cues, big countdown). Runs 100% offline.
- **Watch** — your personal fitness **video feed**. Paste any **YouTube, TikTok, Instagram, Vimeo, or MP4** link and it embeds and plays in-app. Topic chips deep-link into each platform's search so you can find more. Like / save / remove.
- **Log** — track workouts, water, weight, sleep, and energy. 7-day active-minutes chart + weight trend. All private, all offline.
- **You** — level & XP, streak, editable goals, achievements, install helper, downloadable app icon.

## Offline & videos — how it works

The **app shell, workouts, timers, logs, streaks, and saved list all work with no internet** (via a service worker cache). The **videos themselves stream** from YouTube/TikTok/Instagram, so *playback* needs a connection — that's inherent to those platforms. Everything around them keeps working offline.

## Run it locally

Because it uses a service worker, open it over HTTP (not `file://`):

```bash
cd forge
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy (free)

Any static host works — **GitHub Pages**, Netlify, Vercel, Cloudflare Pages. For GitHub Pages: push this folder to a repo, then Settings → Pages → deploy from the branch root. Your app will be live at `https://<user>.github.io/<repo>/`.

## Install on your phone

Open the deployed URL, then:
- **iPhone (Safari):** Share → *Add to Home Screen*.
- **Android (Chrome):** menu → *Install app* (or the in-app **Install** button).

It launches full-screen with its own icon and works offline.

## Icons

`build-icons.js` generates all PNG icons from scratch (no dependencies — pure Node + zlib):

```bash
node build-icons.js
```

## Tech

Single-file vanilla HTML/CSS/JS + a service worker + web manifest. No build step, no framework, no dependencies.

---

_Free forever. Your data never leaves your device._
