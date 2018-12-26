var express = require("express");
var router = express.Router({mergeParams: true});
var Mineral = require("../models/mineral");
var middlewareObj = require("../middleware/index");


// NEW identification ROUTE
router.get("/", function(req, res) {
  res.render("identify/newid.ejs");
});


router.post("/resultados", function(req,res){
  
  var color = req.body.color;
  var pleochroism = req.body.pleochroism;
  var relief = req.body.relief;
  var habit = req.body.habit;
  var cleavage = req.body.cleavage;
  var birefringence = req.body.birefringence;
  var extinction = req.body.extinction;
  var signofelongation = req.body.signofelongation;
  var searchMineral = {color:color, pleochroism:pleochroism, relief:relief, habit:habit, birefringence:birefringence, extinction:extinction, signofelongation:signofelongation, cleavage:cleavage};
  
 Mineral.find({"approved":true}, function (err,mineral) {
      if (err) {
          req.flash("error", err.message);
      } else {
          res.render("identify/resultados.ejs", {lista:mineral, searchMineral:searchMineral}); 
      }
        
    });
});



module.exports = router;
  