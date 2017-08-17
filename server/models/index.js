var db = require('./_db');
var Place = require('./place');
var Hotel = require('./hotel');
var Restaurant = require('./restaurant');
var Activity = require('./activity');
var Itinerary = require('./itinerary');


Hotel.belongsTo(Place);
Restaurant.belongsTo(Place);
Activity.belongsTo(Place);



// Itinerary.belongsToMany(Hotel, {through: 'itinerary_hotel'});
// Itinerary.belongsToMany(Restaurant, {through: 'itinerary_restaurant'});
// Itinerary.belongsToMany(Activity, {through: 'itinerary_activity'});

const IterHotel = db.define('iter_hotel',{});
const IterRestaurant = db.define('iter_restaurant',{});
const IterActivity = db.define('iter_activity',{});


IterHotel.belongsTo(Itinerary);
IterHotel.belongsTo(Hotel);
IterRestaurant.belongsTo(Itinerary);
IterRestaurant.belongsTo(Restaurant);
IterActivity.belongsTo(Itinerary);
IterActivity.belongsTo(Activity);

Itinerary.hasMany(IterRestaurant);
Itinerary.hasMany(IterHotel);
Itinerary.hasMany(IterActivity);

module.exports = {
	db,
	Place,
	Hotel,
	Restaurant,
	Activity,
	Itinerary,
	IterHotel,
	IterRestaurant,
	IterActivity
};
