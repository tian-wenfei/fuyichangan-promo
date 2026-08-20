# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Promotional website for "茯忆长安" (Fuyi Chang'an), a university competition project (中国国际大学生创新大赛 · 高教主赛道 · 创意组) promoting an AI-powered selenium-rich Fucha (茯茶) fermentation device. Content is Chinese; code comments are Chinese.

The project is a **single static site with no build step** — no framework, no npm, no bundler. Three code files:

- `index.html` — the landing page (self-contained: all landing CSS/JS inline) plus the embedded "AI小茯" chatbot panel markup.
- `chat.css` — the chatbot panel's styles, scoped to `.ai-panel`, reusing the design tokens (`--green/--gold/--brown-*/--cream/--line/--font-display`) defined in `index.html`'s `<style>` `:root`.
- `chat.js` — the chatbot: content data, a rule-based intent matcher, the Web Speech API voice layer, and the chat UI state machine (plain DOM JS, no framework).

All other files are static assets (images/videos), `README.md`, `vercel.json`, `图片优化指南.md`.

## Commands

There is **no build/test/lint**. Just serve statically and open in a browser:

```bash
python -m http.server 8080     # then open http://localhost:8080/
```

Must be served over HTTP, not `file://` (the CCTV-hosted missing-children images and Font Awesome CDN require it).

## How the chatbot works (`chat.js`)

The bot is **rule-based, not an LLM** — no API or backend.

- `teamInfo` / `projectFacts` / `greetingMessages` — the single source of content (8 team members, 6 advisors, 3 projects, process steps, stats, pain points, core values, positioning, channels, the 8 missing-children records, contact). Everything here mirrors a section of `index.html` — keep the two in sync.
- `INTENTS` — an ordered array of `{ patterns: RegExp[], reply: string | () => string }`. Order matters: specific intents come before general ones (e.g. `stats`/`rural`/`tech`/`process` are before the broad `projects`/`teamIntro`), to correctly disambiguate compounds like "项目成效". Two ordering traps already fixed — keep them that way: `advisors` must precede `teamName` (whose `/叫什么/` would otherwise swallow "指导老师叫什么"), and `help`'s patterns are deliberately narrowed to `/怎么用你/` rather than `/怎么用/` (which would swallow "溯源系统怎么用").
- `normalize()` + `generateResponse()` — lowercase, strip whitespace/punctuation, then match the first intent whose pattern hits; fallback suggests topics.
- `startRecognition` / `speak` — thin wrappers over `webkitSpeechRecognition` and `speechSynthesis`. The recognition wrapper keeps silence-timeout, network-retry, and an instance-id guard against stale results — port carefully if touching it.
- `initChat()` is lazily called on the first click of the `#aiFab` floating button; it wires DOM events and renders the welcome message + quick questions.

## Architecture notes

- The chatbot renders **inline** in the `.ai-panel` slide-in drawer (opened by `#aiFab`). There is no iframe. The panel-open/close logic lives in `index.html`; the chat internals live in `chat.js`.
- `chat.css` must stay scoped under `.ai-panel` and reuse `index.html`'s `:root` variables — do not add global `body`/`#root` rules or new color variables, or it will clash with the landing page.
- The landing page's team section, the bot's `teamInfo.members`, and `README.md`'s team table are **the same 8 people** (朱晨雨、王奕裴、贾博涵、李青清、冯毅、田文飞、杨晨曦、李思涵). Keep all three in sync if any changes.
- The 6 指导老师 (李华君、王云鹤、靳谐美、李万华、宁国良、时春喜) live in `teamInfo.advisors` and `README.md`; they are **not** shown on the landing page.

## Conventions & gotchas

- Landing-page asset filenames are in Chinese (`2.0发花设备.png`, `微信小程序.jpg`, `茶叶追溯系统.png`) — reference them exactly.
- The landing page's inline JS (scroll spy, counters, video modal, FAB panel) and `chat.js` both register a click handler on `#aiFab`; that's intentional (one opens the drawer, the other lazy-inits the chat).
- No external dependencies except Font Awesome 6.4.0 (CDN) and CCTV-hosted missing-children images.
- 能耗 appears with **two different figures on purpose**: 24% in `teamInfo.projects[0]` (陕南试点实测口径) and 12% in `projectFacts.values` / `index.html` `#value` (全产业口径). They are not a typo — do not "unify" them.
