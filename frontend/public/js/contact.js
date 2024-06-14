document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', createTicket);
    }
});

function createTicket(event) {
    event.preventDefault();

    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ email, message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            alert('Message sent successfully');
            document.getElementById('contact-form').reset();
        } else {
            alert('Failed to send message');
        }
    })
    .catch(error => console.error('Error sending message:', error));
}
