const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('taskList');
const counter = document.getElementById('counter');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filters button');
const logoutBtn = document.getElementById('logoutBtn');

let tasks = [];
let currentFilter = 'all';

const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
};

const handleApiError = (err) => {
  const message = err?.message || 'Erro inesperado no servidor.';
  showToast(message);
  if (message.toLowerCase().includes('token')) {
    Auth.logout();
  }
};

const loadTasks = async () => {
  try {
    const response = await Auth.fetchWithAuth(`/tasks?status=${currentFilter}`);
    tasks = response.data.tasks || [];
    render();
  } catch (err) {
    handleApiError(err);
  }
};

const addTask = async () => {
  const title = input.value.trim();
  if (!title) return;

  addBtn.disabled = true;
  try {
    const response = await Auth.fetchWithAuth('/tasks', {
      method: 'POST',
      body: { title },
    });
    tasks.unshift(response.data.task);
    input.value = '';
    input.focus();
    render();
    showToast(response.message || 'Tarefa criada com sucesso.');
  } catch (err) {
    handleApiError(err);
  } finally {
    addBtn.disabled = false;
  }
};

const toggleTask = async (id) => {
  try {
    const response = await Auth.fetchWithAuth(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    tasks = tasks.map(task => task.id === response.data.task.id ? response.data.task : task);
    render();
    showToast(response.message || 'Tarefa atualizada.');
  } catch (err) {
    handleApiError(err);
  }
};

const removeTask = async (id) => {
  if (!confirm('Deseja excluir esta tarefa?')) return;

  try {
    const response = await Auth.fetchWithAuth(`/tasks/${id}`, {
      method: 'DELETE',
    });
    tasks = tasks.filter(task => task.id !== id);
    render();
    showToast(response.message || 'Tarefa excluída com sucesso.');
  } catch (err) {
    handleApiError(err);
  }
};

const render = () => {
  list.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const left = document.createElement('div');
    left.className = 'task-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const span = document.createElement('span');
    span.textContent = task.title || '';

    left.appendChild(checkbox);
    left.appendChild(span);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.className = 'remove';
    removeBtn.addEventListener('click', () => removeTask(task.id));

    li.appendChild(left);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.completed).length;
  counter.textContent = `${remaining} tarefa(s) pendente(s)`;
};

const initialize = () => {
  if (!Auth.requireLogin()) return;

  addBtn.addEventListener('click', addTask);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  logoutBtn?.addEventListener('click', Auth.logout);

  filterButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelector('.filters .active')?.classList.remove('active');
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      await loadTasks();
    });
  });

  loadTasks();
};

initialize();