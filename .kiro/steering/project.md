# To-Do List Life Dashboard — Project Steering

## Project Overview
A single-page Life Dashboard built with pure HTML, CSS, and Vanilla JavaScript (no frameworks, no backend). Helps users organize their day with a live clock, to-do list, focus timer, and quick links.

## Tech Stack
- **HTML5** — semantic structure
- **CSS3** — custom properties (CSS variables), responsive grid, dark/light theme
- **Vanilla JavaScript (ES6+)** — all interactivity, no libraries or frameworks
- **LocalStorage API** — all data persisted client-side

## Folder Structure
```
/
├── index.html          # Main entry point
├── css/
│   └── style.css       # All styles (dark & light theme)
├── js/
│   └── app.js          # All JavaScript logic
└── .kiro/
    └── steering/
        └── project.md  # This file
```

## Features
1. **Greeting** — live clock (HH:MM:SS), full date, time-based greeting with optional custom name
2. **Focus Timer** — countdown timer with configurable duration (1–120 min), start/stop/reset
3. **To-Do List** — add, edit, complete, delete tasks; persisted to LocalStorage
4. **Quick Links** — add/edit/delete bookmarks with auto-favicon; persisted to LocalStorage
5. **Light / Dark Mode** — toggle via top bar, preference saved to LocalStorage
6. **Custom Name** — personalized greeting, saved to LocalStorage
7. **Custom Pomodoro Duration** — change timer minutes, saved to LocalStorage

## Coding Standards
- Use `'use strict'` in all JS files
- Each feature wrapped in an IIFE to avoid global scope pollution
- CSS uses custom properties (`--var`) for all colors and spacing — never hardcode values
- All user data goes through the `storage` helper (never call `localStorage` directly)
- Accessible: all interactive elements have `aria-label` or visible labels
- No external dependencies — works by opening `index.html` directly in a browser

## Browser Compatibility
Chrome, Firefox, Edge, Safari (all modern versions)
