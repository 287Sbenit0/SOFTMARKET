document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    fetchProducts();
    fetchTickets();

    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', createProduct);
    }
});

function fetchProducts() {
    const productList = document.getElementById('admin-product-list');
    if (productList) {
        fetch('http://localhost:5000/api/products')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    productList.innerHTML = ''; //borrar antes de añadir
                    data.forEach(product => {
                        const productDiv = document.createElement('div');
                        productDiv.className = 'product-item';
                        productDiv.innerHTML = `
                            <div>
                                <h5>${product.name}</h5>
                                <p>${product.description}</p>
                                <p>$${product.price}</p>
                                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                                <button class="btn btn-warning" onclick="updateProduct(${product.id})">Update</button>
                            </div>
                        `;
                        productList.appendChild(productDiv);
                    });
                } else {
                    console.error('Unexpected response format:', data);
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }
}

function createProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const offerStatus = document.getElementById('product-offer-status').checked;

    fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ name, description, price, offer_status: offerStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            alert('Product created successfully');
            fetchProducts();
        } else {
            alert('Product creation failed');
        }
    })
    .catch(error => console.error('Error creating product:', error));
}

function deleteProduct(productId) {
    fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Product deleted successfully');
            fetchProducts();
        } else {
            alert('Product deletion failed');
        }
    })
    .catch(error => console.error('Error deleting product:', error));
}

function updateProduct(productId) {
    const name = prompt('Enter new product name:');
    const description = prompt('Enter new product description:');
    const price = prompt('Enter new product price:');
    const offerStatus = confirm('Is the product on offer?');

    fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ name, description, price, offer_status: offerStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            alert('Product updated successfully');
            fetchProducts();
        } else {
            alert('Product update failed');
        }
    })
    .catch(error => console.error('Error updating product:', error));
}

function fetchTickets() {
    const ticketList = document.getElementById('admin-ticket-list');
    if (ticketList) {
        fetch('http://localhost:5000/api/tickets', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                ticketList.innerHTML = ''; // borrar lista antes de añadir
                data.forEach(ticket => {
                    const ticketDiv = document.createElement('div');
                    ticketDiv.className = 'ticket-item';
                    ticketDiv.innerHTML = `
                        <div>
                            <h5>Ticket ID: ${ticket.id}</h5>
                            <p>${ticket.message}</p>
                            <p>Status: ${ticket.status}</p>
                            <p>Email: ${ticket.email}</p>
                            <button class="btn btn-warning" onclick="updateTicket(${ticket.id})">Update</button>
                            <button class="btn btn-danger" onclick="deleteTicket(${ticket.id})">Delete</button>
                        </div>
                    `;
                    ticketList.appendChild(ticketDiv);
                });
            } else {
                console.error('Unexpected response format:', data);
            }
        })
        .catch(error => console.error('Error fetching tickets:', error));
    }
}

function updateTicket(ticketId) {
    const status = prompt('Enter new ticket status:');

    fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            alert('Ticket updated successfully');
            fetchTickets();
        } else {
            alert('Ticket update failed');
        }
    })
    .catch(error => console.error('Error updating ticket:', error));
}

function deleteTicket(ticketId) {
    fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Ticket was deleted successfully!') {
            alert('Ticket deleted successfully');
            fetchTickets();
        } else {
            alert('Ticket deletion failed');
        }
    })
    .catch(error => console.error('Error deleting ticket:', error));
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