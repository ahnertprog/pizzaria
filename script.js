let modalQt = 1;
let cart = [];
let modalKey = 0;

const qsl = (el) => {
    return document.querySelector(el);
}
const qsla = (el) => {
    return document.querySelectorAll(el);
}

// Listagem das Pizzas
pizzaJson.map((pizza, index ) => {
    let pizzaItem = qsl('.models .pizza-item').cloneNode(true);
    // Preencher as informações em .pizza-item.
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        qsl('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qsl('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qsl('.pizzaBig img').src = pizzaJson[key].img;
        qsl('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        qsl('.pizzaInfo--size.selected').classList.remove('selected');

        qsla('.pizzaInfo--size').forEach((size, sizeIndex)=> {
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

            qsl('.pizzaInfo--qt').innerHTML = modalQt;




        qsl('.pizzaWindowArea').style.opacity = 0;
        qsl('.pizzaWindowArea').style.display = 'flex';

        setTimeout( () => {
            qsl('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    });

    qsl('.pizza-area').append(pizzaItem); 
});

// Eventos do Modal 

qsla('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) =>{
    item.addEventListener('click', closeModal);
});
function closeModal() {
    qsl('.pizzaWindowArea').style.opacity = 0;
    setTimeout( () =>{
        qsl('.pizzaWindowArea').style.display = 'none';
    }, 200);
    console.log('fechou!');
}

qsl('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1){
        modalQt--;
    }
    qsl('.pizzaInfo--qt').innerHTML = modalQt;

});

qsl('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    qsl('.pizzaInfo--qt').innerHTML = modalQt;
});

qsla('.pizzaInfo--size').forEach((size, sizeIndex)=> {
    size.addEventListener('click', (e) => {
        qsl('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
    // Qual a pizza
qsl('.pizzaInfo--addButton').addEventListener('click', () => {
    // Tamanho da pizza 
    let size = parseInt(qsl('.pizzaInfo--size.selected').getAttribute('data-key'));
    // Quntidade de pizza
    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=> item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {

    cart.push({
        identifier,
        id: pizzaJson[modalKey].id,
        size,
        qt: modalQt
    });
    }
    updateCart();
    closeModal();
    
});

    qsl('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0){
        qsl('aside').style.left = '0';
        }
    });
    qsl('.menu-closer').addEventListener('click', () => {
        qsl('aside').style.left = '100vh';
    });

function updateCart() {
    qsl('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        qsl('aside').classList.add('show');
        qsl('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            

            let cartItem = qsl('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
                switch(cart[i].size) {
                    case 0: 
                    pizzaSizeName = 'P';
                        break;
                    case 1: 
                    pizzaSizeName = 'M';
                        break;
                    case 2: 
                    pizzaSizeName = 'G';
                        break;
                }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1 ) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            qsl('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        qsl('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qsl('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qsl('.total.big span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }  else {
        qsl('aside').classList.remove('show');
        qsl('aside').style.left = '100vw';
    }
}