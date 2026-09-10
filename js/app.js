/* =============================================
   LIFE DASHBOARD — app.js
   ============================================= */

'use strict';

/* ── Storage keys ── */
const KEYS = {
  todos:       'ld_todos',
  links:       'ld_links',
  theme:       'ld_theme',       // 'dark' | 'light'
  userName:    'ld_user_name',   // string
  timerMins:   'ld_timer_mins',  // number
};

/* ── Storage helpers ── */
const storage = {
  get: (key) => JSON.parse(localStorage.getItem(key) ?? 'null'),
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
};

/* ==============================================
   0. THEME  — light / dark toggle
   ============================================= */
(function initTheme() {
  const btn  = document.getElementById('btn-theme');
  const body = document.body;

  /* restore saved preference; default = dark */
  let theme = storage.get(KEYS.theme) ?? 'dark';

  function apply(t) {
    if (t === 'light') {
      body.classList.add('light');
      btn.textContent = '☀️ Light';
    } else {
      body.classList.remove('light');
      btn.textContent = '🌙 Dark';
    }
    theme = t;
    storage.set(KEYS.theme, t);
  }

  btn.addEventListener('click', () => apply(theme === 'dark' ? 'light' : 'dark'));

  apply(theme);
})();


/* ==============================================
   1. GREETING  — clock, date & custom name
   ============================================= */
(function initGreeting() {
  const timeEl   = document.getElementById('current-time');
  const dateEl   = document.getElementById('current-date');
  const greetEl  = document.getElementById('greeting-text');
  const nameBtn  = document.getElementById('btn-set-name');

  const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTH_NAMES = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];

  function pad(n) { return String(n).padStart(2, '0'); }

  function getGreeting(hour, name) {
    const who  = name ? `, ${name}` : '';
    if (hour < 12) return `☀️ Good Morning${who}!`;
    if (hour < 17) return `🌤 Good Afternoon${who}!`;
    if (hour < 21) return `🌆 Good Evening${who}!`;
    return `🌙 Good Night${who}!`;
  }

  function tick() {
    const now  = new Date();
    const h    = now.getHours();
    const m    = now.getMinutes();
    const s    = now.getSeconds();
    const name = storage.get(KEYS.userName) ?? '';

    timeEl.textContent  = `${pad(h)}:${pad(m)}:${pad(s)}`;
    dateEl.textContent  = `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
    greetEl.textContent = getGreeting(h, name);
  }

  /* Set / change name via modal */
  nameBtn.addEventListener('click', () => {
    const current = storage.get(KEYS.userName) ?? '';
    openModal({
      title: 'What\'s your name?',
      primaryValue: current,
      primaryPlaceholder: 'Enter your name…',
      showSecondary: false,
      onSave: (val) => {
        storage.set(KEYS.userName, val.trim());
        tick(); /* refresh greeting immediately */
      },
    });
  });

  tick();
  setInterval(tick, 1000);
})();


/* ==============================================
   2. FOCUS TIMER  — with custom duration
   ============================================= */
(function initTimer() {
  const DEFAULT_MINS = 25;

  const displayEl   = document.getElementById('timer-display');
  const startBtn    = document.getElementById('timer-start');
  const stopBtn     = document.getElementById('timer-stop');
  const resetBtn    = document.getElementById('timer-reset');
  const statusEl    = document.getElementById('timer-status');
  const durationInput = document.getElementById('timer-duration-input');
  const durationSetBtn = document.getElementById('timer-duration-set');

  /* restore saved duration or fall back to 25 min */
  let savedMins = storage.get(KEYS.timerMins) ?? DEFAULT_MINS;
  savedMins = Math.min(120, Math.max(1, Number(savedMins)));
  durationInput.value = savedMins;

  let workSeconds = savedMins * 60;
  let remaining   = workSeconds;
  let intervalId  = null;
  let isRunning   = false;

  function pad(n) { return String(n).padStart(2, '0'); }

  function render() {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    displayEl.textContent = `${pad(m)}:${pad(s)}`;
  }

  function setStatus(text) { statusEl.textContent = text; }

  function setRunningStyle(running) {
    displayEl.classList.toggle('running', running);
    displayEl.classList.remove('finished');
  }

  function start() {
    if (isRunning || remaining === 0) return;
    isRunning = true;
    setRunningStyle(true);
    setStatus('Focusing… stay on task!');
    startBtn.disabled = true;

    intervalId = setInterval(() => {
      remaining--;
      render();

      if (remaining <= 0) {
        clearInterval(intervalId);
        isRunning = false;
        displayEl.classList.remove('running');
        displayEl.classList.add('finished');
        setStatus('🎉 Session complete! Take a break.');
        startBtn.disabled = false;
      }
    }, 1000);
  }

  function stop() {
    if (!isRunning) return;
    clearInterval(intervalId);
    isRunning = false;
    setRunningStyle(false);
    setStatus('Paused');
    startBtn.disabled = false;
  }

  function reset() {
    clearInterval(intervalId);
    isRunning = false;
    remaining = workSeconds;
    setRunningStyle(false);
    displayEl.classList.remove('finished');
    render();
    setStatus('Ready to focus');
    startBtn.disabled = false;
  }

  function applyDuration() {
    if (isRunning) {
      setStatus('⚠️ Stop the timer before changing duration.');
      return;
    }
    let mins = parseInt(durationInput.value, 10);
    if (isNaN(mins) || mins < 1)  mins = 1;
    if (mins > 120) mins = 120;
    durationInput.value = mins;
    workSeconds = mins * 60;
    remaining   = workSeconds;
    storage.set(KEYS.timerMins, mins);
    displayEl.classList.remove('finished');
    render();
    setStatus(`Timer set to ${mins} min. Ready to focus`);
  }

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);
  resetBtn.addEventListener('click', reset);
  durationSetBtn.addEventListener('click', applyDuration);
  durationInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyDuration(); });

  render();
})();


/* ==============================================
   3. TO-DO LIST
   ============================================= */
(function initTodo() {
  const listEl   = document.getElementById('todo-list');
  const inputEl  = document.getElementById('todo-input');
  const addBtn   = document.getElementById('todo-add');
  const emptyEl  = document.getElementById('todo-empty');

  /* ── data ── */
  let todos = storage.get(KEYS.todos) ?? [];

  function save() { storage.set(KEYS.todos, todos); }

  function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

  /* ── render ── */
  function render() {
    listEl.innerHTML = '';
    emptyEl.classList.toggle('hidden', todos.length > 0);

    todos.forEach((todo) => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.done ? ' done' : '');
      li.dataset.id = todo.id;

      const checkbox = document.createElement('input');
      checkbox.type      = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked   = todo.done;
      checkbox.setAttribute('aria-label', `Mark "${todo.text}" as done`);
      checkbox.addEventListener('change', () => toggle(todo.id));

      const span = document.createElement('span');
      span.className   = 'todo-text';
      span.textContent = todo.text;

      const actions = document.createElement('div');
      actions.className = 'todo-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-icon';
      editBtn.textContent = '✏️';
      editBtn.title = 'Edit task';
      editBtn.setAttribute('aria-label', `Edit task "${todo.text}"`);
      editBtn.addEventListener('click', () => openTodoModal(todo.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-icon btn-danger';
      delBtn.textContent = '🗑';
      delBtn.title = 'Delete task';
      delBtn.setAttribute('aria-label', `Delete task "${todo.text}"`);
      delBtn.addEventListener('click', () => remove(todo.id));

      actions.append(editBtn, delBtn);
      li.append(checkbox, span, actions);
      listEl.appendChild(li);
    });
  }

  /* ── actions ── */
  function add() {
    const text = inputEl.value.trim();
    if (!text) { inputEl.focus(); return; }
    todos.push({ id: genId(), text, done: false });
    save();
    render();
    inputEl.value = '';
    inputEl.focus();
  }

  function toggle(id) {
    todos = todos.map((t) => t.id === id ? { ...t, done: !t.done } : t);
    save();
    render();
  }

  function remove(id) {
    todos = todos.filter((t) => t.id !== id);
    save();
    render();
  }

  function updateText(id, newText) {
    todos = todos.map((t) => t.id === id ? { ...t, text: newText } : t);
    save();
    render();
  }

  /* ── modal integration ── */
  function openTodoModal(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    openModal({
      title: 'Edit Task',
      primaryValue: todo.text,
      primaryPlaceholder: 'Task description',
      showSecondary: false,
      onSave: (primary) => {
        if (primary.trim()) updateText(id, primary.trim());
      },
    });
  }

  /* ── events ── */
  addBtn.addEventListener('click', add);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });

  render();
})();


/* ==============================================
   4. QUICK LINKS
   ============================================= */
(function initLinks() {
  const listEl     = document.getElementById('links-list');
  const nameInput  = document.getElementById('link-name-input');
  const urlInput   = document.getElementById('link-url-input');
  const addBtn     = document.getElementById('link-add');
  const emptyEl    = document.getElementById('links-empty');

  /* ── data ── */
  let links = storage.get(KEYS.links) ?? [];

  function save() { storage.set(KEYS.links, links); }

  function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

  function ensureProtocol(url) {
    if (!/^https?:\/\//i.test(url)) return 'https://' + url;
    return url;
  }

  function faviconUrl(url) {
    try {
      const origin = new URL(url).origin;
      return `https://www.google.com/s2/favicons?sz=32&domain=${origin}`;
    } catch {
      return '';
    }
  }

  /* ── render ── */
  function render() {
    listEl.innerHTML = '';
    emptyEl.classList.toggle('hidden', links.length > 0);

    links.forEach((link) => {
      const item = document.createElement('div');
      item.className = 'link-item';
      item.dataset.id = link.id;

      const favicon = document.createElement('img');
      favicon.className = 'link-favicon';
      favicon.src = faviconUrl(link.url);
      favicon.alt = '';
      favicon.setAttribute('aria-hidden', 'true');
      favicon.onerror = () => { favicon.style.display = 'none'; };

      const anchor = document.createElement('a');
      anchor.className  = 'link-anchor';
      anchor.href       = link.url;
      anchor.target     = '_blank';
      anchor.rel        = 'noopener noreferrer';
      anchor.textContent = link.name || link.url;
      anchor.title      = link.url;

      const actions = document.createElement('div');
      actions.className = 'link-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn-icon';
      editBtn.textContent = '✏️';
      editBtn.title = 'Edit link';
      editBtn.setAttribute('aria-label', `Edit link "${link.name}"`);
      editBtn.addEventListener('click', () => openLinkModal(link.id));

      const delBtn = document.createElement('button');
      delBtn.className = 'btn-icon btn-danger';
      delBtn.textContent = '🗑';
      delBtn.title = 'Delete link';
      delBtn.setAttribute('aria-label', `Delete link "${link.name}"`);
      delBtn.addEventListener('click', () => remove(link.id));

      actions.append(editBtn, delBtn);
      item.append(favicon, anchor, actions);
      listEl.appendChild(item);
    });
  }

  /* ── actions ── */
  function add() {
    const name = nameInput.value.trim();
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) { urlInput.focus(); return; }
    const url = ensureProtocol(rawUrl);
    links.push({ id: genId(), name: name || url, url });
    save();
    render();
    nameInput.value = '';
    urlInput.value  = '';
    nameInput.focus();
  }

  function remove(id) {
    links = links.filter((l) => l.id !== id);
    save();
    render();
  }

  function update(id, name, url) {
    links = links.map((l) => l.id === id ? { ...l, name, url } : l);
    save();
    render();
  }

  /* ── modal integration ── */
  function openLinkModal(id) {
    const link = links.find((l) => l.id === id);
    if (!link) return;
    openModal({
      title: 'Edit Link',
      primaryValue: link.name,
      primaryPlaceholder: 'Label',
      showSecondary: true,
      secondaryValue: link.url,
      onSave: (name, url) => {
        if (url.trim()) update(id, name.trim() || url.trim(), ensureProtocol(url.trim()));
      },
    });
  }

  /* ── events ── */
  addBtn.addEventListener('click', add);
  urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') add(); });
  nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') urlInput.focus(); });

  render();
})();


/* ==============================================
   5. SHARED MODAL
   ============================================= */
/**
 * Opens the shared edit modal.
 * @param {object} opts
 * @param {string}   opts.title
 * @param {string}   opts.primaryValue
 * @param {string}   opts.primaryPlaceholder
 * @param {boolean}  opts.showSecondary
 * @param {string}  [opts.secondaryValue]
 * @param {Function} opts.onSave  — called with (primaryVal, secondaryVal?)
 */
function openModal(opts) {
  const overlay    = document.getElementById('modal-overlay');
  const titleEl    = document.getElementById('modal-title');
  const primaryEl  = document.getElementById('modal-input-primary');
  const secondaryEl = document.getElementById('modal-input-secondary');
  const saveBtn    = document.getElementById('modal-save');
  const cancelBtn  = document.getElementById('modal-cancel');

  titleEl.textContent        = opts.title;
  primaryEl.value            = opts.primaryValue ?? '';
  primaryEl.placeholder      = opts.primaryPlaceholder ?? '';
  secondaryEl.value          = opts.secondaryValue ?? '';
  secondaryEl.classList.toggle('hidden', !opts.showSecondary);

  overlay.classList.remove('hidden');
  primaryEl.focus();
  primaryEl.select();

  function cleanup() {
    overlay.classList.add('hidden');
    saveBtn.removeEventListener('click', onSave);
    cancelBtn.removeEventListener('click', onCancel);
    overlay.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onKeydown);
  }

  function onSave() {
    opts.onSave(primaryEl.value, secondaryEl.value);
    cleanup();
  }

  function onCancel() { cleanup(); }

  function onOverlayClick(e) { if (e.target === overlay) cleanup(); }

  function onKeydown(e) {
    if (e.key === 'Enter')  { onSave();   }
    if (e.key === 'Escape') { onCancel(); }
  }

  saveBtn.addEventListener('click', onSave);
  cancelBtn.addEventListener('click', onCancel);
  overlay.addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', onKeydown);
}
