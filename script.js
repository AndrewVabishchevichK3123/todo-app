document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.className = 'container';

  const title = document.createElement('h1');
  title.textContent = 'ToDo List';
  container.append(title);

  document.body.append(container);
});