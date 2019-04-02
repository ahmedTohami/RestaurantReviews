let restaurants,
  neighborhoods,
  cuisines
var newMap
var markers = []


document.addEventListener('DOMContentLoaded', (event) => {
  initMap(); // added 
  fetchNeighborhoods();
  fetchCuisines();
});
/**
* Fetch all neighborhoods and set their HTML.
*/
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((neighborhoods) => {
    self.neighborhoods = neighborhoods;
    fillNeighborhoodsHTML();
  });
}

/**
* Set neighborhoods HTML.
*/
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}



/**
* Fetch all cuisines and set their HTML.
*/
fetchCuisines = () => {
  DBHelper.fetchCuisines((cuisines) => {
    self.cuisines = cuisines;
    fillCuisinesHTML();
  });
}

/**
* Set cuisines HTML.
*/
fillCuisinesHTML = (cuisines = self.cuisines) => {
  cuisines.forEach(cuisine => {
    $("#cuisines-select").append($(`<option value=${cuisine}>${cuisine}</option>`))
  });
}

/**
* Initialize leaflet map, called from HTML.
*/
initMap = () => {
  self.newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false
  });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoibWFuZG9saW5hYmxlIiwiYSI6ImNqdHZoeTBsMTAxOXU0M255aGlkbTNrZmYifQ.BDeEIF6BBhLDHe-ZIOH0uQ',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}

/**
* Update page and map for current restaurants.
*/
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (restaurants) => {
    resetRestaurants(restaurants);
    fillRestaurantsHTML();
  })
}

/**
* Clear current restaurants, their HTML and remove their map markers.
*/
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
* Create all restaurants HTML and add them to the webpage.
*/
fillRestaurantsHTML = (restaurants = self.restaurants) => {

  const restaurantslist = $('#restaurants-list')

  restaurants.forEach(restaurant => restaurantslist.append(

    $(`<div class="restaurant">
    <div class="img">
      <img  src=${DBHelper.imageUrlForRestaurant(restaurant)}   alt=${restaurant.name}>
    </div>
    <h4 >${restaurant.name}</h4>
    <p >${restaurant.neighborhood}</p>
    <p >${restaurant.address}</p>
    <a href=${DBHelper.urlForRestaurant(restaurant)} tabindex="3"
      aria-label="view details for ${restaurant.name}" >View Details</a>
  </div>
`)))
  


  addMarkersToMap()
}



/**
* Add markers for current restaurants to the map.
*/
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

}





if('serviceWorker'  in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker
    .register('../sw.js')
    .then(reg=>console.log('service worker : registered '))
    .catch(err=>console.log(`service worker : error  ${err}`));
  })
}