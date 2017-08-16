var router = require("express").Router();
var Hotel = require("../models").Hotel;
var Restaurant = require("../models").Restaurant;
var Activity = require("../models").Activity;
var Itinerary = require("../models").Itinerary;

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

  Itinerary.findById(parseInt(req.params.itinerary_id), { include: [{ all: true }] })
  .then((data)=>{
    res.json(data);
  })
  .catch(next);
})

module.exports = router;
