document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    fetchRecentProducts();
    fetchOfferProducts();
    fetchCheapestProducts();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }
});

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('userRole', data.role);
            if (data.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => console.error('Error logging in:', error));
}

function registerUser(event) {
    event.preventDefault();

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            alert('Registration successful');
            $('#registerModal').modal('hide');
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch(error => console.error('Error registering:', error));
}

function checkLoginStatus() {
    const accessToken = localStorage.getItem('accessToken');
    const logoutButton = document.getElementById('logout-button');
    const cartButton = document.getElementById('cart-button');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');

    if (logoutButton && cartButton && loginButton && registerButton) {
        if (accessToken) {
            logoutButton.style.display = 'block';
            cartButton.style.display = 'block';
            loginButton.style.display = 'none';
            registerButton.style.display = 'none';

            logoutButton.addEventListener('click', handleLogoutClick);

            loadCart();
        } else {
            logoutButton.style.display = 'none';
            cartButton.style.display = 'none';
            loginButton.style.display = 'block';
            registerButton.style.display = 'block';
        }
    }
}

function handleLogoutClick(event) {
    const logoutButton = event.target;
    if (logoutButton.textContent === 'Logout') {
        logoutButton.textContent = 'Accept';
    } else if (logoutButton.textContent === 'Accept') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    }
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartDropdown = document.getElementById('cart-items');
    if (cartDropdown) {
        cartDropdown.innerHTML = '';
        cart.forEach(item => {
            const product = document.createElement('div');
            product.className = 'dropdown-item';
            product.innerHTML = `
                image${item.image_url}
                Product ID: ${item.id} - Quantity: ${item.quantity}
                <button class="btn btn-sm btn-danger float-right remove-from-cart" data-id="${item.id}">Remove</button>
            `;
            cartDropdown.appendChild(product);
        });

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
}

function removeFromCart(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function fetchRecentProducts() {
    fetch('http://localhost:5000/api/products/recent')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                displayCarouselItems(data, 'recent-products-inner', 2);
            } else {
                console.error('Unexpected response format:', data);
            }
        })
        .catch(error => console.error('Error fetching recent products:', error));
}

function fetchOfferProducts() {
    fetch('http://localhost:5000/api/products/offers')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                displayCarouselItems(data, 'offer-products-inner', 1);
            } else {
                console.error('Unexpected response format:', data);
            }
        })
        .catch(error => console.error('Error fetching offer products:', error));
}

function fetchCheapestProducts() {
    fetch('http://localhost:5000/api/products/cheapest')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                displayCarouselItems(data, 'cheapest-products-inner', 3);
            } else {
                console.error('Unexpected response format:', data);
            }
        })
        .catch(error => console.error('Error fetching cheapest products:', error));
}

function displayCarouselItems(products, carouselInnerId, itemsPerPage) {
    const carouselInner = document.getElementById(carouselInnerId);
    if (!carouselInner) return;

    let carouselContent = '';
    for (let i = 0; i < products.length; i += itemsPerPage) {
        carouselContent += `<div class="carousel-item ${i === 0 ? 'active' : ''}"><div class="row">`;
        for (let j = i; j < i + itemsPerPage && j < products.length; j++) {
            const product = products[j];
            carouselContent += `
                <div class="col-${12 / itemsPerPage}">
                    <div class="product-card">
                        <a href="products.html?search=${encodeURIComponent(product.name)}">
                            <div class="card">
                                <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text"><strong>$${product.price}</strong></p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
        }
        carouselContent += '</div></div>';
    }
    carouselInner.innerHTML = carouselContent;
}
