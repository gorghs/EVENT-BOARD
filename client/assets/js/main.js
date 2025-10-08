document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Redirect to login if no token
    if (!token && window.location.pathname !== '/login.html') {
        window.location.href = '/login.html';
        return;
    }

    // Page-specific logic
    if (document.getElementById('login-form')) {
        handleLoginForm();
    }

    if (document.getElementById('events-container')) {
        fetchMyEvents(token);
        handleEventForm(token);
        handleLogout();
    }

    if (document.getElementById('public-events-container')) {
        fetchPublicEvents(token);
        handleLogout();
    }
});

function handleLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        });
    }
}

function handleLoginForm() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/index.html';
            } else {
                errorMessage.textContent = data.error || 'Login failed';
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
        }
    });
}

function handleEventForm(token) {
    const eventForm = document.getElementById('event-form');
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newEvent = {
            title: document.getElementById('title').value,
            date: new Date(document.getElementById('date').value).toISOString(),
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            status: document.getElementById('status').value,
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newEvent),
            });

            if (res.ok) {
                fetchMyEvents(token); // Refresh the list
                eventForm.reset();
            } else {
                alert('Failed to create event.');
            }
        } catch (error) {
            alert('An error occurred while creating the event.');
        }
    });
}

async function fetchMyEvents(token) {
    const eventsContainer = document.getElementById('events-container');
    try {
        const res = await fetch(`${API_BASE_URL}/api/events`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.status === 401) window.location.href = '/login.html';
        const events = await res.json();
        eventsContainer.innerHTML = '';
        if (events.length === 0) {
            eventsContainer.innerHTML = '<p>No events yet. Create one using the form above.</p>';
            return;
        }
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
                <p><strong>Location:</strong> ${event.location || 'N/A'}</p>
                <p><strong>Status:</strong> ${event.status}</p>
                <button class="delete-btn" data-id="${event.id}">Delete</button>
            `;
            eventsContainer.appendChild(eventElement);
        });
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => deleteEvent(e.target.dataset.id, token));
        });
    } catch (error) {
        eventsContainer.innerHTML = '<p>Error: Failed to fetch events.</p>';
    }
}

async function deleteEvent(id, token) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
        const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
            fetchMyEvents(token); // Refresh list
        } else {
            alert('Failed to delete event.');
        }
    } catch (error) {
        alert('An error occurred while deleting the event.');
    }
}

async function fetchPublicEvents(token) {
    const publicEventsContainer = document.getElementById('public-events-container');
    try {
        const res = await fetch(`${API_BASE_URL}/api/events/public-events`);
        const events = await res.json();
        publicEventsContainer.innerHTML = '';
        if (events.length === 0) {
            publicEventsContainer.innerHTML = '<p>No public events available.</p>';
            return;
        }
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.innerHTML = `
                <h3>${event.title}</h3>
                <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
                <p><strong>Source:</strong> ${event.source}</p>
                <p>${event.description}</p>
                <button class="save-btn" data-event='${JSON.stringify(event)}'>Save to My Events</button>
            `;
            publicEventsContainer.appendChild(eventElement);
        });
        // Add event listeners for save buttons
        document.querySelectorAll('.save-btn').forEach(button => {
            button.addEventListener('click', (e) => savePublicEvent(e.target.dataset.event, token));
        });
    } catch (error) {
        publicEventsContainer.innerHTML = '<p>Error: Failed to fetch public events.</p>';
    }
}

async function savePublicEvent(eventData, token) {
    const event = JSON.parse(eventData);
    const newEvent = {
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
        status: 'draft',
    };

    try {
        const res = await fetch(`${API_BASE_URL}/api/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newEvent),
        });

        if (res.ok) {
            alert('Event saved successfully!');
        } else {
            alert('Failed to save event.');
        }
    } catch (error) {
        alert('An error occurred while saving the event.');
    }
}