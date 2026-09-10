# Tasks: To-Do List Life Dashboard

## Task List

- [x] 1. Set up project folder structure
  - Create `css/`, `js/` folders
  - Create `index.html` entry point
  - Create `css/style.css` and `js/app.js` placeholders
  - **Completed:** folders and files created at workspace root

- [x] 2. Build HTML skeleton (`index.html`)
  - Add top bar with brand name, Set Name button, theme toggle button
  - Add greeting section with `#current-date`, `#current-time`, `#greeting-text`
  - Add focus timer card with display, controls, and duration row
  - Add to-do list card with input row and `<ul>`
  - Add quick links card with dual input row and links container
  - Add shared edit modal overlay
  - **Completed:** full semantic HTML structure in place

- [x] 3. Style the dashboard (`css/style.css`)
  - Define CSS custom properties for dark theme on `:root`
  - Define light theme overrides on `body.light`
  - Style top bar (sticky, flex, brand + actions)
  - Style greeting section (gradient background, large clock, greeting text)
  - Style dashboard grid (auto-fit, responsive columns)
  - Style card component (surface, border, radius, shadow)
  - Style button variants (primary, secondary, ghost, icon, danger, sm)
  - Style timer display with `.running` and `.finished` states
  - Style timer duration row
  - Style to-do list items (checkbox, text, actions, done state)
  - Style quick links items (favicon, anchor, actions)
  - Style shared modal (overlay, blur, input, actions)
  - Add responsive breakpoint for ≤ 600px screens
  - **Completed:** full CSS with dark/light themes and responsive layout

- [x] 4. Implement JavaScript logic (`js/app.js`)

  - [x] 4.1 Shared utilities
    - Define `KEYS` constants for all LocalStorage keys
    - Implement `storage.get()` and `storage.set()` helpers

  - [x] 4.2 Theme module (`initTheme`)
    - Restore saved theme on load
    - Toggle `body.light` class on button click
    - Save preference to LocalStorage
    - Update button label to reflect current theme

  - [x] 4.3 Greeting module (`initGreeting`)
    - Live clock updating every second (HH:MM:SS)
    - Full date string (day, date, month, year)
    - Time-based greeting with optional custom name
    - "Set Name" button opens shared modal and saves name to LocalStorage

  - [x] 4.4 Focus timer module (`initTimer`)
    - Restore saved duration from LocalStorage (default 25 min)
    - Start / stop / reset functionality
    - Visual states: default, running (accent glow), finished (success glow)
    - Custom duration input (1–120 min) with Set button
    - Save duration to LocalStorage on apply

  - [x] 4.5 To-do list module (`initTodo`)
    - Restore todos from LocalStorage on load
    - Add task (Enter key or Add button)
    - Toggle done state via checkbox
    - Edit task text via shared modal
    - Delete task
    - Persist all changes to LocalStorage

  - [x] 4.6 Quick links module (`initLinks`)
    - Restore links from LocalStorage on load
    - Add link with label + URL (auto-prepend https://)
    - Display favicon via Google favicon service
    - Open link in new tab
    - Edit link via shared modal (label + URL fields)
    - Delete link
    - Persist all changes to LocalStorage

  - [x] 4.7 Shared modal (`openModal`)
    - Accept opts: title, primaryValue, placeholder, showSecondary, secondaryValue, onSave callback
    - Close on Save, Cancel, Escape key, or overlay click
    - Remove all event listeners on close (no memory leaks)

- [x] 5. Add `.kiro` configuration
  - Create `.kiro/steering/project.md` with project overview and coding standards
  - Create `.kiro/specs/life-dashboard/requirements.md`
  - Create `.kiro/specs/life-dashboard/design.md`
  - Create `.kiro/specs/life-dashboard/tasks.md`
  - **Completed:** full Kiro spec structure in place
