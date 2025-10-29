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

  formGroup.append(taskInput, dateInput, addButton);
  container.append(formGroup);

  document.body.append(container);
});