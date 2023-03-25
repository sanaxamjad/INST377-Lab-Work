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
  const selectedRestaurants = [];

  // Get form data and filter list
  const formData = new FormData(document.querySelector('.main_form'));
  const formProps = Object.fromEntries(formData);
  const filteredList = filterList(currentList, formProps.resto);

  // Select 15 random restaurants
  const selectedIndexes = [];
  while (selectedIndexes.length < 15 && filteredList.length > 0) {
    const randomIndex = getRandomIntInclusive(0, filteredList.length - 1);
    if (!selectedIndexes.includes(randomIndex)) {
      selectedIndexes.push(randomIndex);
      selectedRestaurants.push(filteredList[randomIndex]);
    }
  }

  // Update the restaurant list with the selected restaurants
  injectHTML(selectedRestaurants);
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

let currentList = [];

async function mainEvent() {
  const mainForm = document.querySelector('.main_form');
  const filterButton = document.querySelector('#filter_button');
  const loadDataButton = document.querySelector('#data_load');
  const generateListButton = document.querySelector('#generate');
  const randomRestoButton = document.querySelector('#random_resto');

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
  });

  // Add event listener for "load county data" button
  loadDataButton.addEventListener('click', async () => {
    // Send GET request to API and retrieve data
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    currentList = await results.json();
    console.table(currentList);
    injectHTML(currentList);
  });

  // Listen for random restaurant button click
  randomRestoButton.addEventListener('click', () => {
    const randomIndex = getRandomIntInclusive(0, currentList.length - 1);
    const randomRestaurant = [currentList[randomIndex]];
    injectHTML(randomRestaurant);
  });
}

// Wait for page elements to load before firing main event
document.addEventListener('DOMContentLoaded', mainEvent);