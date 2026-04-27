const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  save();
  input.value = "";
  input.focus();
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  save();
}

function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter(t => !t.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter(t => t.completed);
  }
  return tasks;
}

function render() {
  list.innerHTML = "";

  const filtered = getFilteredTasks();

  filtered.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onclick = () => toggleTask(task.id);

    const span = document.createElement("span");
    span.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(span);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.className = "remove";
    removeBtn.onclick = () => removeTask(task.id);

    li.appendChild(left);
    li.appendChild(removeBtn);

    list.appendChild(li);
  });

  updateUI(filtered);
}

function updateUI(filtered) {
  const remaining = tasks.filter(t => !t.completed).length;
  counter.textContent = `${remaining} tarefa(s) pendente(s)`;

  emptyState.style.display = filtered.length === 0 ? "block" : "none";
}

render();