require("dotenv").config();

/**
 * app.js — Auth helpers shared between register.html, login.html and tasks.html
 * Uses the backend API for auth and preserves JWT in localStorage.
 */

const Auth = (() => {
  const API_BASE = process.env.API || 'back-end-taskflow.vercel.app/api';
  const SESSION_KEY = 'taskflow_session';

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getPasswordStrength(password) {
    const len = password.length;
    if (len === 0) return { width: '0%', color: '#ccc', label: 'Força da senha' };

    let score = 0;
    if (len >= 8) score++;
    if (len >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { width: '25%', color: '#e74c3c', label: 'Muito fraca' };
    if (score === 2) return { width: '50%', color: '#e67e22', label: 'Fraca' };
    if (score === 3) return { width: '75%', color: '#f1c40f', label: 'Boa' };
    return { width: '100%', color: '#27ae60', label: 'Forte' };
  }

  function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  }

  function setSession(user, token) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  async function request(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const init = {
      ...options,
      headers,
    };

    if (options.body) {
      init.body = JSON.stringify(options.body);
    }

    let response;
    try {
      response = await fetch(url, init);
    } catch (err) {
      throw new Error('Não foi possível conectar ao servidor.');
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch (_) {
      payload = null;
    }

    if (!response.ok) {
      const message = payload?.message || `Erro ${response.status}`;
      throw new Error(message);
    }

    return payload;
  }

  async function register(name, email, password) {
    try {
      const data = await request('/auth/register', {
        method: 'POST',
        body: { name, email, password },
      });
      return { success: data.success, message: data.message, data: data.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async function login(email, password) {
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (data.success && data.data) {
        setSession(data.data.user, data.data.token);
      }
      return { success: data.success, message: data.message, data: data.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  function logout() {
    clearSession();
    window.location.href = 'login.html';
  }

  function redirectIfLoggedIn() {
    if (getSession()) {
      window.location.href = 'tasks.html';
    }
  }

  function requireLogin() {
    const session = getSession();
    if (!session || !session.token) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  function getAuthHeaders() {
    const session = getSession();
    return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
  }

  async function fetchWithAuth(path, options = {}) {
    return request(path, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...getAuthHeaders(),
      },
    });
  }

  function showToast(toastEl, message, duration = 3000) {
    if (!toastEl) return;
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
    fetchWithAuth,
    showToast,
    setupPasswordToggles,
  };
})();

window.Auth = Auth;
