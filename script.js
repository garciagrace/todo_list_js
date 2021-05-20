const listsContainer = document.querySelector('[data-lists]');
const listDisplayContainer = document.querySelector(
  '[data-list-display-container]'
);
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const tasksContainer = document.querySelector('[data-tasks]');
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const newTodoForm = document.querySelector('[data-new-todo-form]');
const newTodoInput = document.querySelector('[data-new-todo-input]');
const todoTemplate = document.getElementById('todo-template');
const clearCompleteTasksButton = document.querySelector(
  '[data-clear-complete-tasks-button]'
);
const deleteListButton = document.querySelector('[data-delete-list-button]');

const themeToggle = document.querySelector('[data-theme-toggle]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
const LOCAL_STORAGE_TODO_THEME = 'task.themeMode';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);
let themeMode = localStorage.getItem(LOCAL_STORAGE_TODO_THEME);

// Fetching the ID of selected task on the list
listsContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

// Checked/unchecked specific todo and adjusting total number of todo
tasksContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

// Creating new task
newListForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === '') return;
  const list = createTaskList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

// Creating new todo
newTodoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = newTodoInput.value;
  if (taskName == null || taskName === '') return;
  const task = createTodo(taskName);
  newTodoInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

// Remove completed todo on the list
clearCompleteTasksButton.addEventListener('click', (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
});

// Remove task on the list
deleteListButton.addEventListener('click', (e) => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
  localStorage.removeItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);
});

function createTaskList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTodo(name) {
  return { id: Date.now().toString(), name: name, complete: false };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  // Saving all task list on local storage
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  // Saving selected list ID on local storage
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  // Clear list of task
  clearElement(listsContainer);
  // Rendering list of task
  renderLists();

  const selectedList = lists.find((list) => list.id === selectedListId);
  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none';
  } else {
    // Showing todo list of selected task
    listDisplayContainer.style.display = '';
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTodos(selectedList);
  }

  checkTheme();
}

// Rendering list of task
function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    listsContainer.appendChild(listElement);
  });
}

// Rendering the total number of unfinished todo
function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount <= 1 ? 'task' : 'tasks';
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

// Rendering all todo list of selected task
function renderTodos(selectedList) {
  selectedList.tasks.forEach((task) => {
    const todoElement = document.importNode(todoTemplate.content, true);
    const checkbox = todoElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = todoElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(todoElement);
  });
}

// Clear list of task
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Switch theme mode via toggler
themeToggle.addEventListener('click', (e) => {
  themeMode = themeMode === 'Light' ? 'Dark' : 'Light';
  swicthMode();
});

// Check current theme
function checkTheme() {
  let mode = document.body.classList.contains('dark-mode') ? 'Dark' : 'Light';

  if (mode !== themeMode && themeMode !== null) {
    swicthMode();
  }
}

// Toggle between dark and light theme
function swicthMode() {
  if (themeMode === 'Light') {
    themeToggle.classList.replace('fa-sun', 'fa-moon');
  } else {
    themeToggle.classList.replace('fa-moon', 'fa-sun');
  }

  document.body.classList.toggle('dark-mode');
  document.querySelector('.title').classList.toggle('dark-mode');
  document.querySelector('.todo-header').classList.toggle('dark-mode');
  document.querySelector('.todo-list').classList.toggle('dark-mode');

  // Saving preferred theme mode on local storage
  localStorage.setItem(LOCAL_STORAGE_TODO_THEME, themeMode);
}

render();
