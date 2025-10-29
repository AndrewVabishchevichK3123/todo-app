let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.className = 'container';

  const title = document.createElement('h1');
  title.textContent = 'ToDo List';
  container.append(title);

  const formGroup = document.createElement('div');
  formGroup.className = 'form-group';

  const controls = document.createElement('div');
  controls.className = 'controls';

  const filterSelect = document.createElement('select');
  const allOpt = document.createElement('option'); allOpt.value = 'all'; allOpt.textContent = 'Все';
  const activeOpt = document.createElement('option'); activeOpt.value = 'active'; activeOpt.textContent = 'Активные';
  const compOpt = document.createElement('option'); compOpt.value = 'completed'; compOpt.textContent = 'Выполненные';
  filterSelect.append(allOpt, activeOpt, compOpt);

  const searchInput = document.createElement('input');
  searchInput.placeholder = 'Поиск по названию';

  filterSelect.addEventListener('change', renderTasks);
  searchInput.addEventListener('input', renderTasks);

  controls.append(filterSelect, searchInput);
  container.append(controls);

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

  const sortButton = document.createElement('button');
  sortButton.textContent = 'Сортировать по дате';
  sortButton.addEventListener('click', () => {
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveTasks();
    renderTasks();
  });
  controls.append(sortButton);

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
    const filter = filterSelect.value;
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = tasks.filter(task => {
        const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !task.completed) ||
        (filter === 'completed' && task.completed);
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task';

        li.draggable = true;
        li.setAttribute('data-id', task.id);

        li.addEventListener('dragstart', () => {
        li.classList.add('draggable');
        setTimeout(() => li.style.opacity = '0.4', 0);
        });

        li.addEventListener('dragend', () => {
        li.classList.remove('draggable');
        li.style.opacity = '1';
        });

        li.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        const draggable = document.querySelector('.draggable');
        if (afterElement == null) {
            taskList.appendChild(draggable);
        } else {
            taskList.insertBefore(draggable, afterElement);
        }
        });
        
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

    const taskElements = Array.from(taskList.children);
    const newOrder = taskElements.map(el => {
    const id = Number(el.getAttribute('data-id'));
    return tasks.find(t => t.id === id);
    }).filter(Boolean);

    if (newOrder.length === tasks.length) {
    tasks = newOrder;
    saveTasks(); // сохраняем новый порядок
    }

    }
    });


function isValidDate(dateString) {
  const d = new Date(dateString);
  return d instanceof Date && !isNaN(d) && dateString === d.toISOString().split('T')[0];
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task:not(.draggable)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}