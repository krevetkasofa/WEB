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