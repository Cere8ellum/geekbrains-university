'use strict';
/*
Здесь буду писать что слелано:
1. Заменил 5 на 0 в span ИЗ <span class="cartIconWrap">
    Чтобы выводился 0, если ничего не добавили в корзину
2. Для выпадающей таблички установил блок div с display:none
    С ним и буду работать. Отображать при наведении, добавлять товары к покупке.
3. Снёс всё из app.js, т.к. оно не нужно.
4. Сначала начал привязываться к именам товаров, но вскоре обнаружил, что все
    товары имеют одинаковое описание, и даже цену.
    Поэтому добавил каждой карточке атрибут data-id="some number", 
    для идентификации (в реальном проекте явно из бд тянутся).
    И поменял названия товаров, т.к. были все одинаковые, для удобного
    просмотра корзины
5. Сначала решил добавлять данные в объект, а объект затем вставлять в таблицу,
    затем в div. Но тут проблема. Приходится парсить уже добавленные товары
    (для увеличения кол-ва или итоговой цены).
    А это неудобно и фу. Сделал так конечно, но. 
    Но.
    Сменил стратегию.
    Создал объект, хранящий другие объекты, которые хранят все данные 
    добавляемого в корзину товара.
    Т.е. объект объектов.
    Добавлять товары в виде объектов в объект, помогает класс ItemMaker
    Там и проверяю всё, суммирую.
    А потом просто вываливаю объект в вёрстку.
6. Важный момент. При перезагрузке страницы все данные из объекта cartItemsObj
    удаляются, соответственно очищается и корзина. 
7. Функция removeChar удаляет либо "$", либо "шт."
*/
const cartEl = document.querySelector(".cartIconWrap");
const cartItemsEl = document.querySelector(".cartItems");

cartEl.addEventListener("click", (el) => {
    const display = (cartItemsEl.style.display === "block") ? "none" : "block";
    cartItemsEl.style.display = display;
});

const cartItemsObj = {
    goodsQty: 0,
    goodsPrice: 0
};
document.addEventListener("click", (el) => {
    if (el.target.tagName === "BUTTON" &&
        el.target.parentElement.classList.contains("featuredImgDark")) {
        //Get parent
        const parentEl = el.target.closest(".featuredItem");
        //Get info block
        const infoEl = parentEl.querySelector(".featuredData");
        //Create obj
        const itemObj = new ItemMaker(
            infoEl.children[0].innerText, //name
            1 + "шт.", //qty
            infoEl.children[2].innerText, //price
            infoEl.children[2].innerText, //total price = price
        );

        //Find early added
        const itemId = "item_" + parentEl.dataset.id;
        //Found
        if (itemId in cartItemsObj) {
            //qty ++
            cartItemsObj[itemId].qty = removeChar(
                cartItemsObj[itemId].qty, 3, "R") + 1;
            cartItemsObj[itemId].qty += "шт.";
            //totalPrice ++
            cartItemsObj[itemId].totalPrice = getSummary(
                cartItemsObj[itemId].totalPrice,
                cartItemsObj[itemId].price
            );
            //Not found
        } else {
            cartItemsObj[itemId] = itemObj.getItem();
        }

        //Update totals
        cartItemsObj.goodsQty += 1;
        cartItemsObj.goodsPrice += removeChar(itemObj.price, 1, "L") * 1;

        //Outputting
        const tableEl = document.createElement("TABLE");
        let tableStr = "<tr><th>Название товара</th><th>Количество</th>";
        tableStr += "<th>Цена за шт.</th><th>Итого</th></tr>";
        tableEl.innerHTML = tableStr;

        for (const i in cartItemsObj) {
            const trEl = document.createElement("TR");

            for (const j in cartItemsObj[i]) {
                const tdEl = document.createElement("TD");
                tdEl.innerText = cartItemsObj[i][j]
                trEl.append(tdEl);
            };
            tableEl.append(trEl);
        }

        cartItemsEl.innerHTML = ""; //затираем всё в div
        cartItemsEl.append(tableEl);

        //span
        cartEl.querySelector("span").innerText = cartItemsObj.goodsQty;
        //Summary string in the cart
        const summaryStr = document.createElement("DIV");
        summaryStr.innerText =
            `Товаров в корзине на сумму: $${cartItemsObj.goodsPrice}`;
        cartItemsEl.append(summaryStr);
    }
});

function removeChar(str, len, startSide) {
    const s = str.length - len;
    switch (startSide) {
        case "L":
            return str.substr(len, s) * 1;
        case "R":
            return str.substr(0, s) * 1;
    }
}

function getSummary(totalPrice, price) {
    const tp = removeChar(totalPrice, 1, "L") * 1;
    const p = removeChar(price, 1, "L") * 1;

    return "$" + (tp + p).toFixed(2);
}

class ItemMaker {
    constructor(name, qty, price, totalPrice) {
        this.name = name;
        this.qty = qty;
        this.price = price;
        this.totalPrice = totalPrice;
    }

    /**
     * Возвращает объект с данными из карточки товара
     * @returns {Object}
     */
    getItem() {
        return {
            name: this.name,
            qty: this.qty,
            price: this.price,
            totalPrice: this.totalPrice
        }
    }
}