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

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

// Fetching the ID of selected task on the list
listsContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

// Event listener for creating new task
newListForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === '') return;
  const list = createTaskList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

// Event listener for creating new todo
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

render();
