function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';
  list.forEach((item, index) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

function generateList() {
  const list = [];
  const selectedRestaurants = [];
  const restaurantList = document.getElementById('restaurant_list');

  // Get all the list items from the restaurant list
  const items = restaurantList.getElementsByTagName('li');
  for (let i = 0; i < items.length; i++) {
    list.push(items[i].textContent);
  }

  // Select 15 random restaurants
  while (selectedRestaurants.length < 15) {
    const randomIndex = getRandomIntInclusive(0, list.length - 1);
    if (!selectedRestaurants.includes(list[randomIndex])) {
      selectedRestaurants.push(list[randomIndex]);
    }
  }

  // Update the restaurant list with the selected restaurants
  restaurantList.innerHTML = '';
  selectedRestaurants.forEach((restaurant) => {
    const listItem = document.createElement('li');
    listItem.textContent = restaurant;
    restaurantList.appendChild(listItem);
  });
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

async function mainEvent() {
  const mainForm = document.querySelector('.main_form');
  const filterButton = document.querySelector('#filter_button');
  const loadDataButton = document.querySelector('#data_load');
  const generateListButton = document.querySelector('#generate');

  let currentList = [];

  // Listen for form submission
  mainForm.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();

    console.log('form submission');

    // Send GET request to API and retrieve data
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    currentList = await results.json();
    console.table(currentList);
    injectHTML(currentList);
  });

  // Listen for filter button click
  filterButton.addEventListener('click', (event) => {
    console.log('Clicked FilterButton');

    // Get form data and filter list
    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);
    const newList = filterList(currentList, formProps.resto);

    console.log(newList);
    injectHTML(newList);
  });

  // Listen for generate list button click
  generateListButton.addEventListener('click', () => {
    generateList();
    const list = document.getElementById('restaurant_list');
  });
}

// Wait for page elements to load before firing main event
document.addEventListener('DOMContentLoaded', mainEvent);