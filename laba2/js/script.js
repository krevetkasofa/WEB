// стили
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap';

const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'css/style.css';

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📝</text></svg>";

document.head.append(fontLink, styleLink, favicon);


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
const STORAGE_KEY = 'todo-tasks';

let tasks = loadTasks();

let editingId = null;

let draggedId = null;

//  Работа с задачами 

// Сохранить задачи в localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Загрузить задачи из localStorage
function loadTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

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
    li.draggable = sortSelect.value === 'manual' && task.id !== editingId;

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


// Получить задачи для показа с учётом поиска, фильтра и сортировки
function getVisibleTasks() {
    const query = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;
    const sort = sortSelect.value;

    const result = tasks.filter(function (task) {
        // Поиск по названию
        if (query && !task.title.toLowerCase().includes(query)) {
            return false;
        }

        // Фильтр по статусу
        if (filter === 'active' && task.done) return false;
        if (filter === 'done' && !task.done) return false;

        return true;
    });

    // Сортировка по дате
    if (sort === 'date-asc') {
        result.sort(function (a, b) {
            return a.date.localeCompare(b.date);
        });
    } else if (sort === 'date-desc') {
        result.sort(function (a, b) {
            return b.date.localeCompare(a.date);
        });
    }

    return result;
}



// Нарисовать список задач
function renderTasks() {
    const visibleTasks = getVisibleTasks();

    taskList.replaceChildren();

    visibleTasks.forEach(function (task) {
        taskList.append(createTaskItem(task));
    });

    if (tasks.length === 0) {
        emptyMessage.textContent = 'Задач пока нет';
        emptyMessage.hidden = false;
    } else if (visibleTasks.length === 0) {
        emptyMessage.textContent = 'Ничего не найдено';
        emptyMessage.hidden = false;
    } else {
        emptyMessage.hidden = true;
    }

    saveTasks();
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

function moveTask(fromId, toId, placeAfter) {
    if (fromId === toId) return;

    const fromIndex = tasks.findIndex(function (t) {
        return t.id === fromId;
    });
    if (fromIndex === -1) return;


    const movedTask = tasks.splice(fromIndex, 1)[0];


    let toIndex = tasks.findIndex(function (t) {
        return t.id === toId;
    });

    if (toIndex === -1) {
        tasks.splice(fromIndex, 0, movedTask);
        return;
    }

    if (placeAfter) {
        toIndex = toIndex + 1;
    }

    tasks.splice(toIndex, 0, movedTask);
    renderTasks();
}

function clearDropMarkers() {
    const marked = taskList.querySelectorAll('.task--drop-before, .task--drop-after');

    marked.forEach(function (el) {
        el.classList.remove('task--drop-before', 'task--drop-after');
    });
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


// Поиск, фильтр и сортировка
searchInput.addEventListener('input', renderTasks);
filterSelect.addEventListener('change', renderTasks);
sortSelect.addEventListener('change', renderTasks);

//  Drag-and-drop 

// Начали перетаскивать задачу
taskList.addEventListener('dragstart', function (event) {
    const li = event.target.closest('.task');
    if (!li) return;

    draggedId = li.dataset.id;
    li.classList.add('task--dragging');

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedId);
});

// Ведём задачу над списком
taskList.addEventListener('dragover', function (event) {
    if (!draggedId) return;

    event.preventDefault();

    const target = event.target.closest('.task');
    clearDropMarkers();

    if (!target || target.dataset.id === draggedId) return;

    const rect = target.getBoundingClientRect();
    const isAfter = event.clientY > rect.top + rect.height / 2;

    target.classList.add(isAfter ? 'task--drop-after' : 'task--drop-before');
});

// Отпустили задачу
taskList.addEventListener('drop', function (event) {
    event.preventDefault();

    const target = event.target.closest('.task');
    const fromId = draggedId;

    draggedId = null;

    if (!target || !fromId) {
        clearDropMarkers();
        return;
    }

    const isAfter = target.classList.contains('task--drop-after');
    clearDropMarkers();
    moveTask(fromId, target.dataset.id, isAfter);
});

// Перетаскивание закончилось 
taskList.addEventListener('dragend', function (event) {
    const li = event.target.closest('.task');
    if (li) li.classList.remove('task--dragging');

    draggedId = null;
    clearDropMarkers();
});


renderTasks();