# Requirements: To-Do List Life Dashboard

## Overview
A single-page Life Dashboard that helps users organize their day. The dashboard displays the current time and date, a personalized greeting, a focus timer, a to-do list, and quick-access links to favourite websites. All data is persisted client-side using the browser's LocalStorage API.

---

## Functional Requirements

### FR-1: Greeting & Clock
- **FR-1.1** The dashboard SHALL display the current time in HH:MM:SS format, updating every second.
- **FR-1.2** The dashboard SHALL display the current full date (day name, date, month, year).
- **FR-1.3** The dashboard SHALL display a time-based greeting:
  - 00:00–11:59 → "Good Morning"
  - 12:00–16:59 → "Good Afternoon"
  - 17:00–20:59 → "Good Evening"
  - 21:00–23:59 → "Good Night"
- **FR-1.4** The user SHALL be able to set a custom name that appears in the greeting (e.g. "Good Morning, Zahra!").
- **FR-1.5** The custom name SHALL be persisted in LocalStorage.

### FR-2: Focus Timer
- **FR-2.1** The dashboard SHALL include a countdown timer defaulting to 25 minutes.
- **FR-2.2** The user SHALL be able to start, stop (pause), and reset the timer.
- **FR-2.3** The timer SHALL display the remaining time in MM:SS format.
- **FR-2.4** When the timer reaches 00:00 the dashboard SHALL display a session-complete message.
- **FR-2.5** The user SHALL be able to set a custom timer duration between 1 and 120 minutes.
- **FR-2.6** The custom duration SHALL be persisted in LocalStorage.

### FR-3: To-Do List
- **FR-3.1** The user SHALL be able to add a new task by typing text and pressing Enter or clicking Add.
- **FR-3.2** The user SHALL be able to mark a task as complete using a checkbox.
- **FR-3.3** Completed tasks SHALL be visually distinguished (strikethrough text).
- **FR-3.4** The user SHALL be able to edit the text of an existing task via an edit button.
- **FR-3.5** The user SHALL be able to delete a task via a delete button.
- **FR-3.6** All tasks SHALL be persisted in LocalStorage and restored on page load.

### FR-4: Quick Links
- **FR-4.1** The user SHALL be able to add a quick link by providing a label and a URL.
- **FR-4.2** Each link SHALL open in a new browser tab.
- **FR-4.3** Each link SHALL display a favicon fetched automatically from the target domain.
- **FR-4.4** The user SHALL be able to edit an existing link's label and URL.
- **FR-4.5** The user SHALL be able to delete a quick link.
- **FR-4.6** All links SHALL be persisted in LocalStorage and restored on page load.

### FR-5: Light / Dark Mode
- **FR-5.1** The dashboard SHALL support both a dark theme and a light theme.
- **FR-5.2** The user SHALL be able to toggle between themes via a button in the top bar.
- **FR-5.3** The selected theme SHALL be persisted in LocalStorage and applied on page load.

---

## Non-Functional Requirements

### NFR-1: Technology Constraints
- **NFR-1.1** The project SHALL use only HTML, CSS, and Vanilla JavaScript (no frameworks or libraries).
- **NFR-1.2** The project SHALL NOT require a backend server.
- **NFR-1.3** The project SHALL work by opening `index.html` directly in a browser.

### NFR-2: Data Storage
- **NFR-2.1** All persistent data SHALL be stored exclusively in the browser's LocalStorage.
- **NFR-2.2** No data SHALL be sent to any external server.

### NFR-3: Browser Compatibility
- **NFR-3.1** The dashboard SHALL function correctly in Chrome, Firefox, Edge, and Safari (latest versions).

### NFR-4: Performance
- **NFR-4.1** The page SHALL load within 2 seconds on a standard connection.
- **NFR-4.2** UI interactions SHALL feel instantaneous (no perceptible lag).

### NFR-5: Accessibility & Usability
- **NFR-5.1** All interactive elements SHALL have descriptive `aria-label` attributes or visible labels.
- **NFR-5.2** The interface SHALL be usable on both desktop and mobile screen sizes (responsive layout).
- **NFR-5.3** Typography SHALL be legible with sufficient contrast in both themes.

### NFR-6: Code Quality
- **NFR-6.1** JavaScript SHALL use `'use strict'` mode.
- **NFR-6.2** Each feature module SHALL be wrapped in an IIFE to avoid global scope pollution.
- **NFR-6.3** CSS SHALL use custom properties (`--variable`) for all colors and spacing values.
- **NFR-6.4** There SHALL be exactly one CSS file (`css/style.css`) and one JS file (`js/app.js`).
