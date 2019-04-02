/**
 * Common database helper functions.
 */
class DBHelper {





  /**
   * Database URL.
   */
  static get DATABASE_URL() {
    return `http://localhost:${5500}/data/restaurants.json`
  }



  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {
    return fetch(DBHelper.DATABASE_URL)
  }

  static fetchAllRestaurants(renderCallBack) {
    DBHelper.fetchRestaurants()
      .then(r => r.json())
      .then(r => {
        console.log(r)
        if(renderCallBack) renderCallBack(r);
      })
      .catch(err => console.log(err))
  }

  /**
   * Fetch a restaurant by its ID.
   */

  static fetchRestaurantById(id, renderCallBack) {

    DBHelper.fetchRestaurants()
      .then(r => r.json())
      .then(r => {
        const restaurant = r.restaurants.find(restaurant => restaurant.id == id)
        if (restaurant) {
          if(renderCallBack) renderCallBack(restaurant);
        }
        else {
          throw "no restaurant with this id"
        }
      })
      .catch(err => console.log(err.message))
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine ,renderCallBack) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants()
      .then(r => r.json())
      .then(r => {
        const restaurant = r.restaurants.filter(restaurant => restaurant.cuisine_type == cuisine)
        if (restaurant) {
          console.log(restaurant)
          if(renderCallBack) renderCallBack(restaurant);
        }
        else {
          throw "no restaurant with this cuisine"
        }
      })
      .catch(err => console.log(err.message))
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood ,renderCallBack) {
    // Fetch all restaurants

    DBHelper.fetchRestaurants()
      .then(r => r.json())
      .then(r => {
        const restaurant = r.restaurants.filter(restaurant => restaurant.neighborhood == neighborhood)

        if (restaurant) {
          console.log(restaurant)
          if(renderCallBack) renderCallBack(restaurant);
        }
        else {
          throw "no restaurant with this neighborhood"
        }
      })
      .catch(err => console.log(err.message))
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood , renderCallBack) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants()
      .then(r => r.json())
      .then(r => {
        let results = r.restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(restaurant => restaurant.cuisine_type == cuisine)
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(restaurant => restaurant.neighborhood == neighborhood)
        }
        if (results) {
          if(renderCallBack)renderCallBack(results)
        }
        else {
          throw "no restaurants with this cuisine and neighborhood"
        }
      })
      .catch(err => console.log(err))
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(renderCallBack) {
    // Fetch all restaurants

    DBHelper.fetchRestaurants()
      .then(r => r.json())
      .then(r => {
        const restaurants = r.restaurants
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        if (uniqueNeighborhoods) {
          if(renderCallBack)renderCallBack(uniqueNeighborhoods)
        }
        else {
          throw "error in getting uniqueNeighborhoods"
        }
      })
      .catch(err => console.log(err.message))
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(renderCallBack) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants()
      .then(r => r.json())
      .then(r => {
        const restaurants = r.restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        if (uniqueCuisines) {

        if(renderCallBack)renderCallBack(uniqueCuisines)
         
        }
        else {
          throw "error in getting unique Cuisines"
        }
      })
      .catch(err => console.log(err))
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}`)
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {
        title: restaurant.name,
        alt: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant)
      })
    marker.addTo(newMap);
    return marker;
  }
}

