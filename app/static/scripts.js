document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const placesList = document.getElementById('places-list');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await loginUser(email, password);
    });
  }

  if (placesList) {
    checkAuthentication();
  }
});

async function loginUser(email, password) {
  const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });


  if (response.ok) {
    const data = await response.json();
    document.cookie = `token=${data.access_token}; path=/`;
    window.location.href = '/index';
  } else {
    alert('Login failed: ' + response.statusText);
  }
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  const found = cookies.find(row => row.startsWith(name + '='));
  return found ? found.split('=')[1] : null;
}

function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.querySelector('.login-button');

  if (!token) {
    loginLink.style.display = 'block';
  } else {
    loginLink.style.display = 'none';
    fetchPlaces(token);
  }
}

async function fetchPlaces(token) {
  const response = await fetch('http://127.0.0.1:5000/api/v1/places/', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const places = await response.json();
  displayPlaces(places);
}

function displayPlaces(places) {
  const placesList = document.getElementById('places-list');

  // clear the hardcoded cards from the HTML
  placesList.innerHTML = '';

  // loop through each place from the API and build a card
  places.forEach(place => {
    const card = document.createElement('div');
    card.classList.add('place-card');
    card.dataset.price = place.price; // store price for filtering later

    card.innerHTML = `
      <h2>${place.title}</h2>
      <p>Price per night: $${place.price}</p>
      <a href="/place?id=${place.id}" class="details-button">View Details</a>
    `;

    placesList.appendChild(card);
  });
}

// Filter places by price

document.getElementById('price-filter').addEventListener('change', (event) => {
  const selectedPrice = event.target.value;
  const cards = document.querySelectorAll('.place-card');

  cards.forEach(card => {
    if (selectedPrice === 'all') {
      card.style.display = 'block';
    } else {
      if (card.dataset.price <= selectedPrice) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
});