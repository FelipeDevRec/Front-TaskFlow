/**
 * app.js — Auth helpers shared between register.html and login.html
 * Stores users in localStorage under the key "taskflow_users"
 * Stores the logged-in user under "taskflow_session"
 */

const Auth = (() => {
  const USERS_KEY = 'taskflow_users';
  const SESSION_KEY = 'taskflow_session';

  /* ── helpers ── */

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getPasswordStrength(password) {
    const len = password.length;
    if (len === 0) return { width: '0%', color: '#ccc', label: 'Força da senha' };

    let score = 0;
    if (len >= 8)  score++;
    if (len >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { width: '25%',  color: '#e74c3c', label: 'Muito fraca' };
    if (score === 2) return { width: '50%',  color: '#e67e22', label: 'Fraca' };
    if (score === 3) return { width: '75%',  color: '#f1c40f', label: 'Boa' };
    return              { width: '100%', color: '#27ae60', label: 'Forte' };
  }

  /* ── register ── */

  function register(name, email, password) {
    const users = getUsers();
    const exists = users.some(u => u.email === email);
    if (exists) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }
    users.push({ name, email, password });
    saveUsers(users);
    return { success: true };
  }

  /* ── login ── */

  function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'E-mail ou senha incorretos.' };
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
    return { success: true, user };
  }

  /* ── session ── */

  function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  /* ── redirects ── */

  /** On auth pages (login/register): redirect away if already logged in */
  function redirectIfLoggedIn() {
    if (getSession()) {
      window.location.href = 'tasks.html';
    }
  }

  /** On protected pages (tasks): redirect to login if NOT logged in */
  function requireLogin() {
    if (!getSession()) {
      window.location.href = 'login.html';
    }
  }

  /* ── UI helpers ── */

  function showToast(toastEl, message, duration = 3000) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  function setupPasswordToggles() {
    document.querySelectorAll('[data-toggle-password]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-toggle-password');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        btn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');
      });
    });
  }

  return {
    validateEmail,
    getPasswordStrength,
    register,
    login,
    logout,
    getSession,
    redirectIfLoggedIn,
    requireLogin,
    showToast,
    setupPasswordToggles,
  };
})();
