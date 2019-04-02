let restaurant;
var newMap;





/**
* Initialize map as soon as the page is loaded.
*/
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((restaurant) => {

    self.newMap = L.map('map', {
      center: [restaurant.latlng.lat, restaurant.latlng.lng],
      zoom: 16,
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

    
    $("#breadcrumb").append($(`<li><h1>${restaurant.name}</h1></li>`))
    DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);

  });
}



/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (renderMapCB) => {

  if (self.restaurant) { // restaurant already fetched!
    renderMapCB(self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    throw 'No restaurant id in URL'
  } else {
    DBHelper.fetchRestaurantById(id, (restaurant) => {
      self.restaurant = restaurant;
      fillRestaurantHTML();
      renderMapCB(self.restaurant)

    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {

  const restaurantHTML = $('#restaurant-container')
  restaurantHTML.append(`
  <img id="restaurant-img" tabindex="3"  src=${DBHelper.imageUrlForRestaurant(restaurant)} alt=${restaurant.name} >
  <h1 id="restaurant-name" tabindex="3"   aria-label="${restaurant.name}" >${restaurant.name}</h1>
  <h3 id="restaurant-cuisine" tabindex="3" aria-label="cusine type of this restaurant is ${restaurant.cuisine_type}" >${restaurant.cuisine_type}</h3>
  <h3 id="restaurant-address" tabindex="3"  aria-label="this restaurant address is ${restaurant.address}">${restaurant.address}</h3>
 `);

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  $("#restaurant-container").append($(`<table id="restaurant-hours"  aria-label="operating hours" tabindex="4"></table>`));
  for (let key in operatingHours) {
    $("#restaurant-hours").append(
      `<tr>
      <td >${key}</td>
      <td >${operatingHours[key]}</td>
    </tr>`)
  }
}

// /**
//  * Create all reviews HTML and add them to the webpage.
//  */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {

  

  if (!reviews) {
    $(`#reviews-container`).append(`<h3>No Reviews Yet</h3>`)
    return;
  }
  reviews.forEach(review => {
    $(`#reviews-list`).append( 
      $(`
      <div aria-label="review" tabindex="5">
        <h3 class="name">${review.name}</h3>
        <h3 class="date">${review.date}</h3>
        <h3 class="rate">Rating: ${review.rating}</h3>
        <h3 class="comments">${ review.comments}</h3>
      </div>
      `)
     );
  });
 
}


//got problem 
getParameterByName = (name = 'id', url = window.location.href) => {
  return new URLSearchParams(location.search).get(name);
}


