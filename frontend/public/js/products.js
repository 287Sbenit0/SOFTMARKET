document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    fetchProducts();
    loadCart();

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

    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', toggleCart);
    }

    // Busqueda prod URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        searchProducts(searchQuery);
    }
});

function searchProducts(query) {
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                const filteredProducts = data.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
                displayProducts(filteredProducts);
            } else {
                console.error('Unexpected response format:', data);
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}

function toggleCart() {
    const cart = document.getElementById('cart');
    if (cart) {
        cart.classList.toggle('open');
    }
}



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

    // Regular expressions 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Email simple
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;  // Minimo 8 caracteres, una letra y un numero

  
    if (!emailRegex.test(email)) {
        alert('Introduce un email valido');
        return;
    }

 
    if (!passwordRegex.test(password)) {
        alert('La contraseña tiene que tener 8 caracteres y al menos una letra y un numero');
        return;
    }

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
            alert('Registro completo');
            $('#registerModal').modal('hide');
        } else {
            alert('Registro fallido: ' + data.message);
        }
    })
    .catch(error => console.error('Error registrando:', error));
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

            logoutButton.removeEventListener('click', handleLogoutClick); // quito el anterior para evitar doble mensaje
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
            
                <div class="col-1">
                    <p>${item.name}</p>
                    <p>€${item.price.toFixed(2)}</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <button class="btn btn-danger" data-id="${item.id}" onclick="removeFromCart(event)">Quitar</button>
                </div>
                
       
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
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    productsContainer.innerHTML = '';
    const rowElement = document.createElement('div');
    rowElement.className = 'row';
    productsContainer.appendChild(rowElement);

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
        productElement.innerHTML = `
            <div class="product-card">
                <div class="card">
                    <div class="card-image">
                        <img src="${product.image_url}" alt="${product.name}">
                    </div>
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text"><strong>€${product.price.toFixed(2)}</strong></p>
                        <button class="btn btn-primary add-to-cart" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image_url}')">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `;
        rowElement.appendChild(productElement);
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

                if (offerStatus === '1') {
                    filteredProducts = filteredProducts.filter(product => product.offer_status);
                }

                displayProducts(filteredProducts);
            } else {
                console.error('Unexpected response format:', data);
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}

function addToCart(id, name, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const existingProduct = cart.find(product => product.id === id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();

    console.log(`Producto añadido al carrito: ${name}, ${price}€, ${image}`);
}