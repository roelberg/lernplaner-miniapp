const STORAGE_KEY = 'lernplaner-tasks';
const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#title');
const titleError = document.querySelector('#title-error');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const filterButtons = document.querySelectorAll('[data-filter]');

let tasks = loadTasks();
let activeFilter = 'alle';

function setTitleError(visible) {
  titleError.hidden = !visible;
  titleInput.setAttribute('aria-invalid', String(visible));
}

titleInput.addEventListener('input', () => {
  if (titleInput.value.trim()) setTitleError(false);
});

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function createTaskElement(task) {
  const card = document.createElement('article');
  card.className = `task-card${task.status === 'erledigt' ? ' is-done' : ''}`;

  const main = document.createElement('div');
  main.className = 'task-main';

  const title = document.createElement('h3');
  title.className = 'task-title';
  title.textContent = task.title;

  const meta = document.createElement('div');
  meta.className = 'task-meta';

  const subject = document.createElement('span');
  subject.className = 'task-subject';
  subject.textContent = task.subject;

  const dueDate = document.createElement('span');
  dueDate.textContent = `Fällig am ${formatDate(task.dueDate)}`;

  const priority = document.createElement('span');
  priority.className = 'task-priority';
  const dot = document.createElement('i');
  dot.className = `priority-dot ${task.priority === 'hoch' ? 'high' : task.priority === 'niedrig' ? 'low' : 'normal'}`;
  const priorityText = document.createElement('span');
  priorityText.textContent = task.priority[0].toUpperCase() + task.priority.slice(1);
  priority.append(dot, priorityText);
  meta.append(subject, dueDate, priority);
  main.append(title, meta);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const statusLabel = document.createElement('label');
  statusLabel.className = 'status-control';
  statusLabel.append(document.createTextNode('Status'));

  const status = document.createElement('select');
  status.setAttribute('aria-label', `Status für ${task.title}`);
  for (const value of ['offen', 'erledigt']) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value[0].toUpperCase() + value.slice(1);
    status.append(option);
  }
  status.value = task.status;
  status.addEventListener('change', () => {
    tasks = tasks.map((item) => item.id === task.id ? { ...item, status: status.value } : item);
    saveTasks();
    renderTasks();
  });
  statusLabel.append(status);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.type = 'button';
  deleteButton.textContent = '×';
  deleteButton.setAttribute('aria-label', `Aufgabe „${task.title}“ löschen`);
  deleteButton.addEventListener('click', () => {
    tasks = tasks.filter((item) => item.id !== task.id);
    saveTasks();
    renderTasks();
  });

  actions.append(statusLabel, deleteButton);
  card.append(main, actions);
  return card;
}

function renderTasks() {
  taskList.replaceChildren();
  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'Aufgabe' : 'Aufgaben'}`;

  const visibleTasks = activeFilter === 'alle'
    ? tasks
    : tasks.filter((task) => task.status === activeFilter);

  if (visibleTasks.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = tasks.length === 0
      ? 'Noch keine Aufgaben. Füge deine erste Lernaufgabe hinzu.'
      : 'Keine Aufgaben für diesen Status.';
    taskList.append(emptyState);
    return;
  }

  for (const task of visibleTasks) {
    taskList.append(createTaskElement(task));
  }
}

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    for (const filterButton of filterButtons) {
      const isActive = filterButton === button;
      filterButton.classList.toggle('is-active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    }
    renderTasks();
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!titleInput.value.trim()) {
    setTitleError(true);
    titleInput.focus();
    return;
  }
  setTitleError(false);
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const task = {
    id: crypto.randomUUID(),
    title: formData.get('title').trim(),
    subject: formData.get('subject').trim(),
    dueDate: formData.get('dueDate'),
    priority: formData.get('priority'),
    status: 'offen'
  };

  tasks.unshift(task);
  saveTasks();
  renderTasks();
  form.reset();
});

renderTasks();
