// стили
const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'css/style.css';

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📝</text></svg>";

document.head.append(styleLink, favicon);


// Создание элемент с классом и текстом
function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
}

// Создание выпадающий список 
function createSelect(className, label, options) {
    const select = createEl('select', className);
    select.setAttribute('aria-label', label);

    options.forEach(function (opt) {
        const option = createEl('option', '', opt.text);
        option.value = opt.value;
        select.append(option);
    });

    return select;
}

//  Шапка 
const header = createEl('header', 'header');
const headerTitle = createEl('h1', 'header__title', 'Список дел');
header.append(headerTitle);

//  Основная часть 
const main = createEl('main', 'main');

//  Секция «Новая задача» 
const addSection = createEl('section', 'panel');
const addTitle = createEl('h2', 'panel__title', 'Новая задача');

const taskForm = createEl('form', 'task-form');

const titleInput = createEl('input', 'input task-form__title');
titleInput.type = 'text';
titleInput.placeholder = 'Что нужно сделать?';
titleInput.required = true;
titleInput.setAttribute('aria-label', 'Название задачи');

const dateInput = createEl('input', 'input task-form__date');
dateInput.type = 'date';
dateInput.required = true;
dateInput.setAttribute('aria-label', 'Дата выполнения');

const addButton = createEl('button', 'button button--primary', 'Добавить');
addButton.type = 'submit';

taskForm.append(titleInput, dateInput, addButton);
addSection.append(addTitle, taskForm);

// Секция «Мои задачи» 
const tasksSection = createEl('section', 'panel');
const tasksTitle = createEl('h2', 'panel__title', 'Мои задачи');

const controls = createEl('div', 'controls');

const searchInput = createEl('input', 'input controls__search');
searchInput.type = 'search';
searchInput.placeholder = 'Поиск по названию';
searchInput.setAttribute('aria-label', 'Поиск по названию');

const filterSelect = createSelect('input controls__select', 'Фильтр по статусу', [
    { value: 'all', text: 'Все задачи' },
    { value: 'active', text: 'Невыполненные' },
    { value: 'done', text: 'Выполненные' },
]);

const sortSelect = createSelect('input controls__select', 'Сортировка', [
    { value: 'manual', text: 'Мой порядок' },
    { value: 'date-asc', text: 'Сначала ранние' },
    { value: 'date-desc', text: 'Сначала поздние' },
]);

controls.append(searchInput, filterSelect, sortSelect);

const taskList = createEl('ul', 'task-list');
const emptyMessage = createEl('p', 'tasks__empty', 'Задач пока нет');

tasksSection.append(tasksTitle, controls, taskList, emptyMessage);

main.append(addSection, tasksSection);

// Подвал 
const footer = createEl('footer', 'footer');
const footerText = createEl('p', '', '© 2026 Список дел');
footer.append(footerText);

document.body.append(header, main, footer);

//  Данные 
let tasks = [];

let editingId = null;

//  Работа с задачами 


function formatDate(dateString) {
    const parts = dateString.split('-');
    return parts[2] + '.' + parts[1] + '.' + parts[0];
}


// форму редактирования задачи
function createEditForm(task) {
  const form = createEl('form', 'task__edit');

  const titleField = createEl('input', 'input task__edit-title');
  titleField.type = 'text';
  titleField.name = 'title';
  titleField.value = task.title;
  titleField.required = true;
  titleField.setAttribute('aria-label', 'Новое название задачи');

  const dateField = createEl('input', 'input task__edit-date');
  dateField.type = 'date';
  dateField.name = 'date';
  dateField.value = task.date;
  dateField.required = true;
  dateField.setAttribute('aria-label', 'Новая дата');

  const saveButton = createEl('button', 'button button--primary', 'Сохранить');
  saveButton.type = 'submit';

  const cancelButton = createEl('button', 'button button--ghost', 'Отмена');
  cancelButton.type = 'button';
  cancelButton.dataset.action = 'cancel';

  form.append(titleField, dateField, saveButton, cancelButton);
  return form;
}

// Создать элемент списка для одной задачи
function createTaskItem(task) {
  const li = createEl('li', 'task');
  li.dataset.id = task.id;

  if (task.done) {
    li.classList.add('task--done');
  }

  const checkbox = createEl('input', 'task__checkbox');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', 'Отметить как выполненную');


  if (task.id === editingId) {
    li.append(checkbox, createEditForm(task));
    return li;
  }

  const content = createEl('div', 'task__content');
  const title = createEl('span', 'task__title', task.title);
  const date = createEl('time', 'task__date', formatDate(task.date));
  date.dateTime = task.date;
  content.append(title, date);

  const actions = createEl('div', 'task__actions');

  const editButton = createEl('button', 'button button--ghost', 'Изменить');
  editButton.type = 'button';
  editButton.dataset.action = 'edit';

  const deleteButton = createEl('button', 'button button--danger', 'Удалить');
  deleteButton.type = 'button';
  deleteButton.dataset.action = 'delete';

  actions.append(editButton, deleteButton);
  li.append(checkbox, content, actions);
  return li;
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(function (task) {
        taskList.append(createTaskItem(task));
    });

    emptyMessage.hidden = tasks.length > 0;
}

// Добавить новую задачу
function addTask(title, date) {
    const task = {
        id: String(Date.now()),
        title: title,
        date: date,
        done: false,
    };

    tasks.push(task);
    renderTasks();
}


// Переключить статус задачи
function toggleTask(id) {
    const task = tasks.find(function (t) {
        return t.id === id;
    });

    if (!task) return;

    task.done = !task.done;
    renderTasks();
}

// Удалить задачу
function deleteTask(id) {
    tasks = tasks.filter(function (t) {
        return t.id !== id;
    });

    renderTasks();
}

// Начать редактирование задачи
function startEdit(id) {
  editingId = id;
  renderTasks();

  const field = taskList.querySelector('.task__edit-title');
  if (field) field.focus();
}

// Отменить редактирование
function cancelEdit() {
  editingId = null;
  renderTasks();
}

// Сохранить изменения задачи
function updateTask(id, title, date) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });

  if (!task) return;

  task.title = title;
  task.date = date;
  editingId = null;
  renderTasks();
}


//  Обработчики событий 

// Отправка формы добавления задачи
taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    if (!title) return;

    addTask(title, dateInput.value);
    taskForm.reset();
    titleInput.focus();
});



// Флажок выполнено
taskList.addEventListener('change', function (event) {
  if (!event.target.classList.contains('task__checkbox')) return;

  const id = event.target.closest('.task').dataset.id;
  toggleTask(id);
});

// Кнопки внутри задач
taskList.addEventListener('click', function (event) {
  const button = event.target.closest('button');
  if (!button) return;

  const id = button.closest('.task').dataset.id;
  const action = button.dataset.action;

  if (action === 'delete') {
    if (confirm('Удалить задачу?')) {
      deleteTask(id);
    }
  } else if (action === 'edit') {
    startEdit(id);
  } else if (action === 'cancel') {
    cancelEdit();
  }
});

// Сохранение формы редактирования
taskList.addEventListener('submit', function (event) {
  event.preventDefault();

  const form = event.target;
  const id = form.closest('.task').dataset.id;
  const title = form.elements.title.value.trim();
  const date = form.elements.date.value;

  if (!title) return;

  updateTask(id, title, date);
});

// Отмена редактирования клавишей Esc
taskList.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && editingId) {
    cancelEdit();
  }
});


renderTasks();