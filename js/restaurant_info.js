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

    let breadcrumb = document.getElementById('breadcrumb')
    let li = document.createElement('li')
    let h1 = document.createElement('h1')
    h1.innerText = restaurant.name

    li.append(h1)
    breadcrumb.append(li)

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

  const restaurantHTML = document.getElementById('restaurant-container')

  let img = document.createElement('img')
  img.src = DBHelper.imageUrlForRestaurant(restaurant)
  img.alt = restaurant.name
  img.setAttribute('id', 'restaurant-img')
  img.tabIndex = 3


  let name = document.createElement('h1')
  name.setAttribute('id', "restaurant-name")
  name.setAttribute('aria-label', restaurant.name)
  name.innerText = restaurant.name
  name.tabIndex = 3

  let cuisine = document.createElement('h3')
  cuisine.setAttribute('id', 'restaurant-cuisine')
  cuisine.tabIndex = 3
  cuisine.innerText = restaurant.cuisine_type
  cuisine.setAttribute('aria-label', `cusine type of this restaurant is ${restaurant.cuisine_type}`)


  let address = document.createElement('h3')
  cuisine.setAttribute('id', 'restaurant-address')
  address.tabIndex = 3
  address.innerText = restaurant.address
  address.setAttribute('aria-label', `this restaurant address is ${restaurant.address}`)

  restaurantHTML.append(img)
  restaurantHTML.append(name)
  restaurantHTML.append(cuisine)
  restaurantHTML.append(address)

  //   restaurantHTML.append(`
  //   <img id="restaurant-img" tabindex="3"  src=${} alt=${} >
  //   <h1 id= tabindex="3"   ="${}" >${restaurant.name}</h1>
  //   <h3 id="" tabindex="3"  >${}</h3>
  //   <h3 id="" tabindex="3"  aria-label="this restaurant address is ${restaurant.address}">${restaurant.address}</h3>
  //  `);

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
  let restaurantContainer = document.getElementById('restaurant-container')

  let table = document.createElement('table')
  table.setAttribute('id', 'restaurant-hours')
  table.tabIndex = 4
  table.setAttribute('aria-label', 'operating hours')

  restaurantContainer.append(table)
  for (let key in operatingHours) {

    let tr = document.createElement('tr')
    let keytd = document.createElement('td')
    let Hourstd = document.createElement('td')
    keytd.innerText = key
    Hourstd.innerText = operatingHours[key]

    tr.append(keytd)
    tr.append(Hourstd)
    table.append(tr)
  }


}

// /**
//  * Create all reviews HTML and add them to the webpage.
//  */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {



  if (!reviews) {
    let reviewsContainer = document.getElementById('reviews-container')
    let h3 = document.createElement('h3')
    h3.innerText = `No Reviews Yet`
    reviewsContainer.append(h3)
    return;
  }
  reviews.forEach(review => {

    let reviewslist = document.getElementById('reviews-list')
    let div = document.createElement('div')
    div.setAttribute('aria-label', "review")
    div.tabIndex = 5

    let name = document.createElement('h3')
    name.innerText = "date: " + review.name
    name.classList.add('name')

    let date = document.createElement('h3')
    date.innerText = "date: " + review.date
    date.classList.add('date')


    let rating = document.createElement('h3')
    rating.innerText = "rate: " + review.rating
    rating.classList.add('rate')

    let comments = document.createElement('h3')
    comments.innerText = "comments: " + review.comments
    comments.classList.add('comments')

    div.append(name)
    div.append(date)
    div.append(rating)
    div.append(comments)

    reviewslist.append(div)


  });

}



getParameterByName = (name = 'id', url = window.location.href) => {
  return new URLSearchParams(location.search).get(name);
}


