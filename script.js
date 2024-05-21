'use strict';

// Variables
const addBtn = document.querySelectorAll('#btn');
const minusbutton = document.querySelectorAll('.btn__minus');
let totalValue = document.querySelector('.total-value');
let billTotal = document.querySelector('.bill__total__amount');
const composition = document.querySelector('.composition__items');

// Clear basket button
const clearItems = document.querySelector('.clear-basket');

// Confirm order button
const confirmOrderBtn = document.querySelector('.button-main');

const itemList = document.getElementsByTagName('ul');
// Price information

// bill
const bill = document.querySelector('.bill');
const billBackground = document.querySelector('.bill-background');
const billClose = document.querySelector('.bill__close');
const billItems = document.querySelector('.bill__items');
let cashAmount = document.querySelector('.cash-amount');

const sushi = {
  itemName: 'shushi',
  price: 9.99,
};
const okonomiyaki = {
  itemName: 'okonomiyaki',
  price: 29.99,
};
const misoSoup = {
  itemName: 'miso Soup',
  price: 10.99,
};
const yakitori = {
  itemName: 'yakitori',
  price: 15.99,
};
const udon = {
  itemName: 'udon',
  price: 10.99,
};
const takoyaki = {
  itemName: 'takoyaki',
  price: 15.99,
};
const soba = {
  itemName: 'soba',
  price: 59.99,
};
const sukiyaki = {
  itemName: 'sukiyaki',
  price: 49.99,
};
const ramen = {
  itemName: 'ramen',
  price: 39.99,
};
const pasta = {
  itemName: 'pasta',
  price: 35.99,
};

const menu = {
  sushi,
  okonomiyaki,
  misoSoup,
  yakitori,
  udon,
  takoyaki,
  soba,
  sukiyaki,
  ramen,
  pasta,
};

let i = 1;
let total = 0;
let itemsAdded = [];

let itemId = 0;

const displayTotal = function (totalVal) {
  if (typeof totalVal === 'number') {
    totalValue.innerText = `${totalVal.toFixed(2)}$`;
    billTotal.innerText = `${totalVal.toFixed(2)}$`;
    cashAmount.innerText = `${totalVal.toFixed(2)}$`;
  } else {
    console.error('Total value is not a number:', totalVal);
  }
};

const clearInputs = function () {
  composition.innerText = '';
  totalValue.innerText = '';
  billTotal.innerText = '';
  cashAmount.innerText = '0';
};

addBtn.forEach(function (btn) {
  btn.addEventListener('click', function () {
    const nameOfItem = menu[btn.dataset.name].itemName;
    const priceOfItem = menu[btn.dataset.name].price;
    const arrOfItem = menu[btn.dataset.name];

    const html = `
    <div class="composition__item" data-id="${itemId}">item-${i++} ${nameOfItem} - ${priceOfItem}$
    <button class="btn btn__minus" data-price="${priceOfItem}" data-id="${itemId}">&minus;</button>
    </div>
    `;
    composition.insertAdjacentHTML('beforeend', html);

    // Update itemsAdded array
    itemsAdded.push(priceOfItem);

    total = itemsAdded.reduce((acc, price) => acc + price, 0);

    const html2 = `
    <div class="bill__items__item" data-id="${itemId}">
            <p class="name">${nameOfItem}</p>
            <p class="price">${priceOfItem}$</p>
          </div>
    `;
    billItems.insertAdjacentHTML('beforeend', html2);

    // Displaying the calculated balance
    displayTotal(total);

    itemId++;
  });
});

const updateItemIndexes = function () {
  const items = composition.querySelectorAll('.composition__item');
  items.forEach((item, index) => {
    const itemName = item.innerText.split(' ')[1];
    const itemPrice = item.querySelector('.btn__minus').dataset.price;
    item.innerHTML = `item-${
      index + 1
    } ${itemName} - ${itemPrice}$<button class="btn btn__minus" data-price="${itemPrice}" data-id="${
      item.dataset.id
    }">&minus;</button>`;
  });
  // Update i to the current number of items + 1
  i = items.length + 1;
};

// Can't access the element with the class .btn__minus as it was created using insertAdjacentHTML, so used event delegation
composition.addEventListener('click', function (event) {
  if (event.target.classList.contains('btn__minus')) {
    // event.target = <button> element

    // price of removing item
    const priceOfRemovingitem = Number(event.target.dataset.price);

    // index of removing item
    const indexOfremovedItem = itemsAdded.findIndex(
      num => num === priceOfRemovingitem
    );

    // item element in the bill
    const billItemToRemove = billItems.querySelector(
      `.bill__items__item[data-id="${event.target.dataset.id}"]`
    );
    if (billItemToRemove) {
      // removing the element from DOM
      billItemToRemove.remove();
    }

    // item element
    const itemToRemove = event.target.closest('.composition__item');
    if (itemToRemove) {
      // removing the element from DOM
      itemToRemove.remove();

      // remove the relevant price element from the array
      itemsAdded.splice(indexOfremovedItem, 1);

      // Calculating new total
      total -= priceOfRemovingitem;

      // Displaying the new total
      displayTotal(total);

      if (total <= 0) {
        clearInputs();

        i = 1;
      } else {
        updateItemIndexes();
      }
    }
  }
});

clearItems.addEventListener('click', function () {
  itemsAdded = [];
  // itemsAdded.splice(0, itemsAdded.length);
  total = 0;
  i = 1;
  clearInputs();

  // item element in the bill
  const billItemToDlt = billItems.querySelectorAll('.bill__items__item');

  billItemToDlt.forEach(function (item) {
    if (item) {
      // removing the element from DOM
      item.remove();
    }
  });
});

// open bill
confirmOrderBtn.addEventListener('click', function () {
  bill.classList.remove('hidden');
  billBackground.classList.remove('hidden');
});

// close bill
billClose.addEventListener('click', function () {
  bill.classList.add('hidden');
  billBackground.classList.add('hidden');
});

// display today date
const today2 = new Intl.DateTimeFormat(navigator.language, {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
}).format(new Date());

document.querySelector('.bill__heading__date').innerText = today2;
