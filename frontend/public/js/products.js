document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    fetchProducts();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', applyFilters);
    }

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
            alert('Logged in successfully');
            checkLoginStatus();
            $('#loginModal').modal('hide');
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

            logoutButton.removeEventListener('click', handleLogoutClick); // Remove any previous event listener to prevent multiple triggers
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

function fetchProducts() {
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                displayProducts(data);
            } else {
                console.error('Unexpected response format:', data);
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'col-md-4';
        productDiv.innerHTML = `
            <div class="card mb-4">
                <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>$${product.price}</strong></p>
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        productList.appendChild(productDiv);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.col-md-4');

    productCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function applyFilters(event) {
    event.preventDefault();

    const filterForm = event.target;
    const formData = new FormData(filterForm);
    const priceRange = formData.get('price-range');
    const offerStatus = formData.get('offer-status');

    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                let filteredProducts = data;

                if (priceRange) {
                    const [minPrice, maxPrice] = priceRange.split('-').map(Number);
                    filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
                }

                if (offerStatus) {
                    const offerStatusBool = offerStatus === 'on';
                    filteredProducts = filteredProducts.filter(product => product.offer_status === offerStatusBool);
                }

                displayProducts(filteredProducts);
            } else {
                console.error('Unexpected response format:', data);
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}

function addToCart(event) {
    const productId = event.target.dataset.id;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const productInCart = cart.find(item => item.id == productId);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    alert('Product added to cart');
    
}
