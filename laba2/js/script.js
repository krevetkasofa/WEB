// стили
const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'css/style.css';

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📝</text></svg>";

document.head.append(styleLink, favicon);

console.log('подключилост');