let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.className = 'container';

  const title = document.createElement('h1');
  title.textContent = 'ToDo List';
  container.append(title);

  const formGroup = document.createElement('div');
  formGroup.className = 'form-group';

  const taskInput = document.createElement('input');
  taskInput.type = 'text';
  taskInput.placeholder = 'Название задачи';

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.valueAsDate = new Date();

  const addButton = document.createElement('button');
  addButton.textContent = 'Добавить';
  addButton.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const date = dateInput.value;
    if (!text || !date) return;

    const newTask = {
      id: Date.now(),
      text,
      date,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
  });

  formGroup.append(taskInput, dateInput, addButton);
  container.append(formGroup);

  const taskList = document.createElement('ul');
  taskList.className = 'tasks';
  container.append(taskList);

  document.body.append(container);

  renderTasks();

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task';
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = `${task.text} (${task.date})`;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? '↩️' : '✅';
    completeBtn.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.addEventListener('click', () => {
    const newText = prompt('Новый текст:', task.text);
    if (newText === null) return;
    const newDate = prompt('Новая дата (ГГГГ-ММ-ДД):', task.date);
    if (newDate === null || !isValidDate(newDate)) return;
    task.text = newText.trim();
    task.date = newDate;
    saveTasks();
    renderTasks();
    });

    actions.append(completeBtn, editBtn, deleteBtn);

    li.append(span, actions);
    taskList.append(li);
  });
}
});

function isValidDate(dateString) {
  const d = new Date(dateString);
  return d instanceof Date && !isNaN(d) && dateString === d.toISOString().split('T')[0];
}