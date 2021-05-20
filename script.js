const listsContainer = document.querySelector('[data-lists]');
const listDisplayContainer = document.querySelector(
  '[data-list-display-container]'
);
const tasksContainer = document.querySelector('[data-tasks]');
const listTitleElement = document.querySelector('[data-list-title]');

const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = [
  { id: '1', name: 'a' },
  { id: '2', name: 'b' },
];
let selectedListId = null;

// Fetching the ID of selected task on the list
listsContainer.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

function saveAndRender() {
  save();
  render();
}

function save() {
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
    clearElement(tasksContainer);
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

// Clear list of task
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
