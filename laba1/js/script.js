console.log('Скрипт подключён');

console.log('Скрипт подключён!');

// Находим все кнопки добавить в корзину
const addButtons = document.querySelectorAll('.card__btn');

// говорим кнопке, что делать при нажатии
addButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        console.log('Нажали:', id, name, price);
    });
});