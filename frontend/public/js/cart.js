document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    displayCartItems();

    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    updateTotalPrice();
}

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        updateTotalPrice();
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'col-md-4 mb-4';
        cartItem.innerHTML = `
            <div class="card">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">€${item.price.toFixed(2)}</p>
                    <p class="card-text">Cantidad: ${item.quantity}</p>
                    <button class="btn btn-danger" data-id="${item.id}" onclick="removeFromCart(event)">Eliminar</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });
    updateTotalPrice();
}

function removeFromCart(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
        } else {
            cart.splice(productIndex, 1);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    displayCartItems();
}

async function handleCheckout(event) {
    event.preventDefault();

    const address = document.getElementById('address').value;
    const creditCard = document.getElementById('credit-card').value;

    const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
    const creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;

    if (!addressRegex.test(address)) {
        alert('Please enter a valid address.');
        return;
    }

    if (!creditCardRegex.test(creditCard)) {
        alert('Please enter a valid credit card number.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    try {
        const response = await fetch('http://localhost:5000/api/orders/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart, address, creditCard })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Order created successfully:', data);
        localStorage.removeItem('cart');
        loadCart();
        displayCartItems();
        $('#checkoutModal').modal('hide');
    } catch (error) {
        console.error('Error creating order:', error);
    }
}

function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total-price').textContent = `€${totalPrice.toFixed(2)}`;
}
