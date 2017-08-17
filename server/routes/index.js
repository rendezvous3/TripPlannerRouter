var router = require("express").Router();
var Hotel = require("../models").Hotel;
var Restaurant = require("../models").Restaurant;
var Activity = require("../models").Activity;
var Itinerary = require("../models").Itinerary;
var IterHotel = require("../models").IterHotel;
var IterRestaurant = require("../models").IterRestaurant;
var IterActivity = require("../models").IterActivity;
	// IterHotel,
	// IterRestaurant,
	// IterActivity

router.get("/", (req, res, next) => {
  Promise.all([
    Hotel.findAll({ include: [{ all: true }] }),
    Restaurant.findAll({ include: [{ all: true }] }),
    Activity.findAll({ include: [{ all: true }] })
  ])
    .then(([hotels, restaurants, activities]) => {
      res.json({
        hotels,
        restaurants,
        activities
      });
    })
    .catch(next);
});

router.get('/itineraries/:itinerary_id', function(req, res, next){

  Itinerary.findById(parseInt(req.params.itinerary_id), { include: [{ all: true, nested: true }] })
  .then((data)=>{
    res.json(data);
  })
  .catch(next);
})

router.post('/itineraries', function(req, res, next){
  var hotelsIds = req.body.hotels.map((x) => parseInt(x));
  var restIds = req.body.restaurants.map((x) => parseInt(x));
  var actIds = req.body.activities.map((x) => parseInt(x));
  var idRed;
  console.log('**********************************************************************',hotelsIds)
  Itinerary.create({})
  .then((it)=>{
      var masterPromise = [];
      var hotelPs = hotelsIds.forEach(function(x){
        IterHotel.create({ itineraryId: it.id, hotelId: x })
      }),
      masterPromise = masterPromise.concat(hotelPs);
      var restPs = restIds.forEach(function(y){
        IterRestaurant.create({ itineraryId: it.id, restaurantId: y })
      }),
      masterPromise = masterPromise.concat(restPs);
      var actPs = actIds.forEach(function(z){
        IterActivity.create({ itineraryId: it.id, activityId: z })
      }),
      masterPromise = masterPromise.concat(restPs);
    Promise.all(masterPromise)
    .then((whatever)=>{
      console.log('**************************', it.id)
      res.redirect('/#' + it.id);
    })
  })
  .catch(next)
})

module.exports = router;
