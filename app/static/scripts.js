document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const placesList = document.getElementById('places-list');
  const placeDetails = document.querySelector('.place-details');

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

  if (placeDetails) {
    const token = getCookie('token');
    const placeId = getPlaceIdFromURL();
    const addReviewSection = document.querySelector('.add-review');

    if (!token) {
      window.location.href = '/index';
    } else {
  addReviewSection.style.display = 'block';
    }

    fetchPlaceDetails(token, placeId);

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const reviewText = document.getElementById('review-text').value;
        const rating = document.getElementById('rating').value;
        await submitReview(token, placeId, reviewText, rating);
      });
  }

    console.log('Place ID from URL:', placeId);
    console.log('Token:', token);
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

const priceFilter = document.getElementById('price-filter');
if (priceFilter) {
  priceFilter.addEventListener('change', (event) => {
    const selectedPrice = event.target.value;
    const cards = document.querySelectorAll('.place-card');

    cards.forEach(card => {
      if (selectedPrice === 'all') {
        card.style.display = 'block';
      } else {
        if (Number(card.dataset.price) <= Number(selectedPrice)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      }
    });
  });
}

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// ADD AFTER getPlaceIdFromURL function
async function fetchPlaceDetails(token, placeId) {
  const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const place = await response.json();
  displayPlaceDetails(place);
}

function displayPlaceDetails(place) {
  const placeDetails = document.querySelector('.place-details');
  placeDetails.innerHTML = `
    <h1>${place.title}</h1>
    <div class="place-info">
      <p><strong>Host:</strong> ${place.owner.first_name} ${place.owner.last_name}</p>
      <p><strong>Price per night:</strong> $${place.price}</p>
      <p><strong>Description:</strong> ${place.description}</p>
    </div>
  `;
}

async function submitReview(token, placeId, reviewText, rating) {
  const response = await fetch('http://127.0.0.1:5000/api/v1/reviews/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      text: reviewText,
      rating: parseInt(rating),
      place_id: placeId
    })
  });

  if (response.ok) {
    alert('Review submitted successfully!');
    document.getElementById('review-form').reset();
  } else {
    const data = await response.json();
    alert('Failed to submit review: ' + data.error);
  }
}