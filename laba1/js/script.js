// Ключ
const STORAGE_KEY = 'flower-shop-cart';

let cart = loadCart();

// Элементы
const addButtons = document.querySelectorAll('.card__btn');
const cartList = document.getElementById('cart-list');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const orderBtn = document.getElementById('order-btn');
const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
const closeDialogBtn = document.getElementById('close-dialog');


//  Функции 

// Добавить товар в корзину
function addToCart(id, name, price) {
    const existing = cart.find(function (item) {
        return item.id === id;
    });

    if (existing) {
        existing.qty = existing.qty + 1;
    } else {
        cart.push({ id: id, name: name, price: price, qty: 1 });
    }

    renderCart();
}

// Посчитать общ сум 
function getTotal() {
    let total = 0;
    cart.forEach(function (item) {
        total = total + item.price * item.qty;
    });
    return total;
}

// Изменить количество товара 
function changeQty(id, delta) {
    const item = cart.find(function (cartItem) {
        return cartItem.id === id;
    });

    if (!item) return;

    item.qty = item.qty + delta;

    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }

    renderCart();
}

// Удалить товар из корзины
function removeFromCart(id) {
    cart = cart.filter(function (cartItem) {
        return cartItem.id !== id;
    });

    renderCart();
}

function renderCart() {
    cartList.innerHTML = '';

    cart.forEach(function (item) {
        const li = document.createElement('li');
        li.className = 'cart__item';
        li.dataset.id = item.id;
        li.innerHTML = `
      <div class="cart__info">
        <span class="cart__name">${item.name}</span>
        <span class="cart__price">${item.price * item.qty} ₽</span>
      </div>
      <div class="cart__controls">
        <button class="cart__qty-btn" type="button" data-action="decrease">−</button>
        <span class="cart__qty">${item.qty}</span>
        <button class="cart__qty-btn" type="button" data-action="increase">+</button>
        <button class="cart__remove" type="button" data-action="remove">✕</button>
      </div>
    `;
        cartList.appendChild(li);
    });

    cartTotal.textContent = getTotal();
    cartEmpty.hidden = cart.length > 0;
    orderBtn.disabled = cart.length === 0;
    saveCart();
}

// Сохранить корзину в localStorage
function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// Загрузить корзину из localStorage
function loadCart() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch (error) {
        return [];
    }
}


// Обработчики событий

// Кнопки Добавить в корзину
addButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        addToCart(id, name, price);
    });
});

// Кнопки −, + и ✕ внутри корзины
cartList.addEventListener('click', function (event) {
    const button = event.target.closest('button');
    if (!button) return;

    const id = button.closest('.cart__item').dataset.id;
    const action = button.dataset.action;

    if (action === 'increase') {
        changeQty(id, 1);
    } else if (action === 'decrease') {
        changeQty(id, -1);
    } else if (action === 'remove') {
        removeFromCart(id);
    }
});

// Открыть форму заказа
orderBtn.addEventListener('click', function () {
    orderDialog.showModal();
});

// Закрыть форму по кнопке Отмена
closeDialogBtn.addEventListener('click', function () {
    orderDialog.close();
});

// Отправка формы заказа
orderForm.addEventListener('submit', function (event) {
    event.preventDefault();

    alert('Заказ создан!');

    cart = [];
    renderCart();
    orderForm.reset();
    orderDialog.close();
});

// Первая отрисовка при загрузке страницы
renderCart();