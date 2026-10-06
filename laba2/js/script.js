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