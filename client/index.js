const mapboxgl = require("mapbox-gl");
const buildMarker = require("./marker");
const attractions = require("./attractions");

/*
 * App State
 */

const state = {
  hotels: [],
  restaurants: [],
  activities: []
};

/*
  * Instantiate the Map
  */

mapboxgl.accessToken = "pk.eyJ1IjoiY2Fzc2lvemVuIiwiYSI6ImNqNjZydGl5dDJmOWUzM3A4dGQyNnN1ZnAifQ.0ZIRDup0jnyUFVzUa_5d1g";
const map = new mapboxgl.Map({
  container: "map-canvas",
  center: [-74.0, 40.731],
  zoom: 12.3, // starting zoom
  pitch: 35,
  bearing: 20,
  style: "mapbox://styles/mapbox/streets-v10"
});

/*
  * Populate the list of attractions
  */

attractions.load().then(list => {
  list.hotels.forEach(attraction => makeOption(attraction, "hotels-choices"));
  list.restaurants.forEach(attraction => makeOption(attraction, "restaurants-choices"));
  list.activities.forEach(attraction => makeOption(attraction, "activities-choices"));
});

function makeOption(attraction, selector) {
  const option = new Option(attraction.name, attraction.id); // makes a new option tag
  const select = document.getElementById(selector);
  select.add(option);
}

/*
  * Attach Event Listeners
  */

// what to do when the `+` button next to a `select` is clicked
["hotels", "restaurants", "activities"].forEach(addEventHandlerFor);
function addEventHandlerFor(attractionType) {
  document.getElementById(`${attractionType}-add`).addEventListener("click", () => handleAddAttraction(attractionType));
}

// Create attraction assets (itinerary item, delete button & marker)
function handleAddAttraction(attractionType) {
  const select = document.getElementById(`${attractionType}-choices`);
  const selectedId = select.value;

  // Find the correct attraction given the category and ID
  const selectedAttraction = attractions.find(attractionType, selectedId);

  // If this attraction is already on state, return
  if (state[attractionType].find(attractionData => +attractionData.id === +selectedId)) return;

  //Build and add attraction
  buildAttractionAssets(attractionType, selectedAttraction);
}

function buildAttractionAssets(category, attraction) {
  // Create the Elements that will be inserted in the dom
  const removeButton = document.createElement("button");
  removeButton.className = "btn btn-xs btn-danger remove btn-circle";
  removeButton.append("x");

  const itineraryItem = document.createElement("li");
  itineraryItem.className = "itinerary-item";
  itineraryItem.append(attraction.name, removeButton);

  // Create the marker
  const marker = buildMarker(category, attraction.place.location);

  // Create an 'attractionData' object that will be added to the state.
  // It contains the assets created plus all the original selected attraction data.
  const attractionData = Object.assign(
    {
      assets: {
        itineraryItem,
        marker
      }
    },
    attraction
  );

  // Adds the attraction to the application state
  state[category].push(attractionData);

  addAttractionToDOM(category, attractionData);
  removeButton.addEventListener("click", function remove() {
    // Stop listening for the event
    removeButton.removeEventListener("click", remove);

    // Remove the current attrction from the application state
    const index = state[category].indexOf(attractionData);
    state[category].splice(index, 1);

    removeAttractionFromDOM(category, attractionData);
  });
}

function addAttractionToDOM(category, attractionData) {
  // Append attraction elements to the DOM & Map
  document.getElementById(`${category}-list`).append(attractionData.assets.itineraryItem);
  attractionData.assets.marker.addTo(map);

  // Animate the map
  map.flyTo({ center: attractionData.place.location, zoom: 15 });
}

function removeAttractionFromDOM(category, attractionData) {
  // Remove attraction's elements from the dom & Map
  attractionData.assets.itineraryItem.remove();
  attractionData.assets.marker.remove();

  // Animate map to default position & zoom.
  map.flyTo({ center: [-74.0, 40.731], zoom: 12.3 });
}

// if(location.hash){
fetch('/api/itineraries/' + location.hash.slice(1))
.then(result => result.json())
.then((it) => {
  console.log(it.iter_hotels)
  //it.hotels.forEach(function(x){
  it.iter_hotels.forEach(function(x){
    buildAttractionAssets("hotels", x.hotel);
  })
  //it.restaurants.forEach(function(x){
  it.iter_restaurants.forEach(function(x){
    buildAttractionAssets("restaurants", x.restaurant);
  })
  //it.activities.forEach(function(x){
  it.iter_activities.forEach(function(x){
    buildAttractionAssets('activities', x.activity);
  })
})
.catch(console.error)

// }


document.getElementById('submitBtn').addEventListener('click', function(){
  //console.log(state);
  var hotelIds = state.hotels.map(function(x){ return x.id });
  var restIds = state.restaurants.map(function(x){ return x.id });
  var actIds = state.activities.map(function(x){ return x.id });
  fetch('/api/itineraries', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify({
      'hotels': hotelIds,
      'restaurants': restIds,
      'activities': actIds,
    })
  });
})
// fetch()
