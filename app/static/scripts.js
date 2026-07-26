/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

// Get a cookie by a given name and return content
function getCookieByName(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}


// Run on page loaded
document.addEventListener('DOMContentLoaded', () => {

  // Remove the login button if the user has a cookie
  if (getCookieByName('token')) {
    document.getElementById('login-link').remove();
  }

  // Add login functionality if this page is login.html
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      form = document.getElementById('login-form');
      // Send form data to login function
      loginUser(form.elements['email'].value, form.elements['password'].value)
    });
  }

  // Load all places if this page is index.html
  const index = document.getElementById('places-list');
  if (index) {
    // Also add options to select box
    const select = document.getElementById('price-filter');
    const optionAll = document.createElement('option');
    optionAll.text = 'All'
    const option100 = document.createElement('option');
    option100.text = '100'
    const option50 = document.createElement('option');
    option50.text = '50'
    const option10 = document.createElement('option');
    option10.text = '10'
    select.add(optionAll);
    select.add(option100);
    select.add(option50);
    select.add(option10);
    // Add options to the price filter
    select.addEventListener('change', (event) => {
      // Get the selected price value
      const filter = parseInt(document.getElementById('price-filter').value);
      // Iterate over the places and show/hide them based on the selected price
      const list = document.getElementById('places-list').children[0].children;
      for (let i = 0; i < list.length; i++) {
        if (isNaN(filter) || filter > parseInt(list[i].classList[1])) {
          list[i].style.display = 'flex';
        } else {
          list[i].style.display = 'none';
        }
      }
    });
    getAllPlaces();
  }
});

async function loginUser(email, password) {
  // Add a loading / message box while waiting
  const message = document.getElementById('login-form-message');
  message.textContent = 'Processing your request...';
  const response = await fetch('http://localhost:5000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  // Handle the response
  console.log(response);
  // If login failed
  if (response.status === 401) {
    message.textContent = 'Your email or password is incorrect, please try again.';
  } else if (response.status !== 200) {
    message.textContent = 'Something unexpected happened, please try again later.';
  } else if (response.status === 200) {
    message.textContent = 'Login successful, please wait...';
    document.cookie = `token=${(await response.json()).access_token}; path=/`;
    document.location.href = 'index';
  }
}


// Send request for all places from api
async function getAllPlaces() {
  const headerObj = {
    'Content-Type': 'application/json'
  };
  // Add JWT if we have it in cookie
  const cookie = getCookieByName('token');
  if (cookie) {
    headerObj['Authorizaton'] = 'bearer ' + cookie;
  }
  // Send fetch
  const response = await fetch('http://localhost:5000/api/v1/places/', {
    method: 'GET',
    headers: headerObj
  })
  const data = await response.json();
  section = document.getElementById('places-list');
  // Check if there are no places in response
  if (data.length === 0) {
    const message = document.createElement('h2');
    message.className = 'place-card';
    message.textContent = 'There are no places here yet!';
    section.appendChild(message);
  } else {
    // Make unordered list
    const list = document.createElement('ul');
    // Make item for each place in list
    for (let i = 0; i < data.length; i++) {
      const item = document.createElement('li');
      // Title
      const title = document.createElement('h2');
      title.textContent = data[i].title;
      // Price
      const price = document.createElement('p');
      price.textContent = 'Price per night: $' + data[i].price;
      // Details
      const details = document.createElement('a');
      details.textContent = 'View Details'
      details.href = 'place'
      item.appendChild(title);
      item.appendChild(price);
      item.appendChild(details);
      item.className = 'place-card';
      // Set id depending on price for use with filter
      priceNum = parseInt(data[i].price);
      if (priceNum > 100) {
        item.classList.add('All');
      } else if (priceNum > 50) {
        item.classList.add('100');
      } else if (priceNum > 10) {
        item.classList.add('50');
      } else {
        item.classList.add('10');
      }
      list.appendChild(item);
    }
    // Add unordered list to section
    section.appendChild(list);
  }
}


