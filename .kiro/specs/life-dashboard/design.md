# Design: To-Do List Life Dashboard

## Architecture Overview

The application is a fully client-side, single-page web app with zero dependencies. It follows a simple **module-per-feature** pattern — each feature lives in its own IIFE inside `js/app.js`, sharing only a lightweight `storage` helper and the global `openModal` function.

```
index.html          ← HTML structure & DOM skeleton
css/style.css       ← All visual styling (dark + light themes via CSS variables)
js/app.js           ← All runtime logic, split into 6 IIFE modules
```

---

## File Structure

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── .kiro/
    ├── steering/
    │   └── project.md
    └── specs/
        └── life-dashboard/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

---

## HTML Structure (`index.html`)

```
<body>
  ├── .topbar                    ← sticky top bar: brand, Set Name btn, theme toggle
  ├── <header.greeting-section>  ← date, clock, greeting text
  └── <main.dashboard>           ← CSS grid, 3 cards
      ├── section.timer-card     ← focus timer
      ├── section.todo-card      ← to-do list
      └── section.links-card     ← quick links
  └── #modal-overlay             ← shared edit modal (hidden by default)
```

---

## CSS Architecture (`css/style.css`)

### Theme System
All colors are defined as CSS custom properties on `:root` (dark, default) and overridden on `body.light` (light mode). No color is hardcoded outside these two blocks.

```css
:root          { --bg: #0f1117; --surface: #1a1d27; ... }  /* dark */
body.light     { --bg: #f0f2f8; --surface: #ffffff; ... }  /* light */
```

Toggling themes is a single class toggle on `<body>`:
```js
document.body.classList.toggle('light');
```

### Layout
- Top bar: flexbox, `position: sticky; top: 0`
- Dashboard: `display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`
- Cards: uniform padding, border, border-radius using `--radius` variable

---

## JavaScript Architecture (`js/app.js`)

### Shared Utilities (top-level)

```js
const KEYS = { todos, links, theme, userName, timerMins }  // LocalStorage key constants

const storage = {
  get(key)      // JSON.parse(localStorage.getItem(key))
  set(key, val) // localStorage.setItem(key, JSON.stringify(val))
}
```

### Module 0 — Theme (`initTheme`)
- Reads saved theme from LocalStorage on load, applies immediately
- Button click toggles `body.light` class and saves new preference

### Module 1 — Greeting (`initGreeting`)
- `setInterval(tick, 1000)` updates clock, date, greeting every second
- Greeting text includes custom name if set: `"Good Morning, {name}!"`
- "Set Name" button opens the shared modal; on save, writes to `KEYS.userName`

### Module 2 — Focus Timer (`initTimer`)
- State: `remaining` (seconds), `isRunning`, `intervalId`, `workSeconds`
- `start()` — sets `setInterval` at 1 s, decrements `remaining`
- `stop()` — clears interval, sets `isRunning = false`
- `reset()` — clears interval, restores `remaining = workSeconds`
- `applyDuration()` — validates input (1–120), sets `workSeconds`, saves to LocalStorage, calls `reset()`
- Visual states on `#timer-display`: default | `.running` (accent glow) | `.finished` (success glow)

### Module 3 — To-Do List (`initTodo`)
- Data shape: `[{ id, text, done }]`
- `render()` — clears `<ul>`, rebuilds DOM from array; toggles `.empty-hint`
- `add()` — pushes new item, saves, renders
- `toggle(id)` — flips `done`, saves, renders
- `remove(id)` — filters array, saves, renders
- `updateText(id, text)` — maps over array, saves, renders
- Edit uses shared `openModal()`

### Module 4 — Quick Links (`initLinks`)
- Data shape: `[{ id, name, url }]`
- `faviconUrl(url)` — extracts origin, returns Google favicon service URL
- `ensureProtocol(url)` — prepends `https://` if missing
- Same add/remove/update/render pattern as To-Do
- Edit uses shared `openModal()` with secondary URL field visible

### Module 5 — Shared Modal (`openModal`)
- Single modal instance reused by all features
- Accepts an `opts` object: `{ title, primaryValue, primaryPlaceholder, showSecondary, secondaryValue, onSave }`
- Cleanup function removes all event listeners after close (save, cancel, overlay click, Escape key)

---

## Data Flow

```
User interaction
      │
      ▼
Event listener (module)
      │
      ▼
Mutate in-memory array / state
      │
      ├──▶ storage.set()  →  LocalStorage
      │
      └──▶ render() / DOM update
```

On page load, each module calls `storage.get()` to restore its data before the first render.

---

## LocalStorage Schema

| Key              | Type    | Description                        |
|------------------|---------|------------------------------------|
| `ld_todos`       | Array   | `[{ id, text, done }]`             |
| `ld_links`       | Array   | `[{ id, name, url }]`              |
| `ld_theme`       | String  | `'dark'` or `'light'`              |
| `ld_user_name`   | String  | User's display name                |
| `ld_timer_mins`  | Number  | Timer duration in minutes (1–120)  |
