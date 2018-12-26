var express = require("express");
var router = express.Router();
var Mineral = require("../models/mineral");
var middlewareObj = require("../middleware/index");

//Cloudinary and multer configuration (Image upload)
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Somente imagens sao permitidas!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dt6x7dyxc', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
//END Cloudinary and multer configuration (Image upload)




// ==== APROVE ROUTE ===
router.get("/aprovar", middlewareObj.isAdmin, function(req, res) {
    Mineral.find({}, function (err,mineral) {
       if (err) {
           req.flash("error", err.message);
       } else {
           res.render("minerais/aprovar.ejs", {lista:mineral}); 
       }
        
    });
   
    
});

// ==== EDIT APROVE ROUT ===
router.get("/aprovar", middlewareObj.isAdmin, function(req, res) {
    Mineral.find({}, function (err,mineral) {
       if (err) {
           req.flash("error", err.message);
       } else {
           res.render("minerais/aprovar.ejs", {lista:mineral}); 
       }
        
    });
   
    
});
// ============================
// EDIT APROVE ROUTES
// ===========================
router.get("/:id/editaprovar", middlewareObj.isAdmin, function(req,res) {
 Mineral.findById(req.params.id, function(err, foundMineral) {
    if (err) {
        console.log(err);
    } else {
        res.render("minerais/editaprovar.ejs", {mineral:foundMineral});
    }
 })  ; 
    
});

// update
router.put("/:id", middlewareObj.isAdmin, upload.single('image'), function(req,res) {

     if (req.file) {
        Mineral.findById (req.params.id, function(err, mineral) {
            if (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
            }
            //delete the file from cloudinary
            cloudinary.v2.uploader.destroy(mineral.imageId, function(err,result) {
                if(err) {
                        req.flash("error",err.message);
                        return res.redirect("back");
                }
                //Upload a new one
                cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                    if(err) {
                            req.flash("error",err.message);
                            return res.redirect("back");
                    }
                    // add cloudinary url for the same image to the mineral object under image propety
                    req.body.image = result.secure_url;
                    //add image public_id to animal object
                    req.body.imageId = result.public_id;
                    Mineral.findByIdAndUpdate(req.params.id, req.body, function (err, foundMineral) {
                            if(err) {
                                req.flash("error",err.message);
                                res.redirect("back");
                            } else {
                                req.flash("success","Editado com sucesso");
                                res.redirect("/minerais/"+req.params.id);
                            }
                    });
                });
            });
        }); 
         
            } else {
                Mineral.findByIdAndUpdate(req.params.id, req.body, function (err, foundMineral) {
                        if(err) {
                            req.flash("error",err.message);
                            res.redirect("back");
                        } else {
                            req.flash("success","Editado com sucesso");
                            res.redirect("/minerais/"+req.params.id);
                        }
                });
            }
});


// INDEX ROUTE
router.get("/", function(req,res){
    var perPage = 12;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Mineral.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allMinerais) {
            Mineral.count({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allMinerais.length < 1) {
                        res.flash("error", "Mineral nao encontrado");
                        res.redirect("back");
                    }
                    res.render("minerais/index.ejs", {
                        lista: allMinerais,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        search: req.query.search
                    });
                }
            });
        });
    } else {
        // get all minerals from DB
        Mineral.find({"approved":true}).sort( "name" ).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allMinerais) {
            Mineral.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("minerais/index.ejs", {
                        lista: allMinerais,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        search: false
                    });
                }
            });
        });
    }
});

// NEW ROUTE
router.get("/novo", middlewareObj.isLoggedIn, function(req, res) {
    res.render("minerais/new.ejs");
});



// CREATE ROUTE
router.post("/",middlewareObj.isLoggedIn,upload.single('image'), function(req,res){
cloudinary.uploader.upload(req.file.path, function(result) {
    // add cloudinary url for the image to the campground object under image property

  req.body.image = result.secure_url;
  req.body.imageId = result.public_id;
    
   var name = req.body.name;
   var image = req.body.image;
   var imageId = req.body.imageId;
   var image2 = req.body.image2;
   var image3 = req.body.image3;
   var formula = req.body.formula;
   var description = req.body.description;
   var reference = req.body.reference;
   var video = req.body.video;
   var associatemineral = req.body.associatemineral;
   var distinfeat = req.body.distinfeat;
   var mineralclass = req.body.mineralclass;
   var author = {
       id: req.user._id,
   username: req.user.username
   };
   var macro = req.body.macro;
   var planelight = req.body.planelight;
   var crossedlight = req.body.crossedlight;
   
   var newMineral = {name:name, image:image, imageId:imageId, description:description, reference:reference, distinfeat:distinfeat, associatemineral:associatemineral, mineralclass:mineralclass,
   author:author, formula:formula, image2:image2, image3:image3, macro:macro, planelight:planelight, crossedlight:crossedlight, video:video};
  Mineral.create(newMineral, function(err,novomineral){
     if (err) {
         req.flash("error",err);
         res.redirect("back");
     }  else {
          res.redirect("/minerais/"+ novomineral.id);
     }
  });
});
  
});

// SHOW ROUTE
router.get("/:id", function(req, res) {
    Mineral.findById(req.params.id).populate("comments").exec(function(err, foundMineral){
       if (err || !foundMineral) {
        req.flash("error", "Mineral nao encontrado");
        res.redirect("back");
       } else {
         
      res.render("minerais/show.ejs", {mineral:foundMineral}); 
       }
        
    });
   
});

// ============================
// EDIT UPDATE ROUTES
// ===========================
router.get("/:id/edit", middlewareObj.isAdmin, function(req,res) {
 Mineral.findById(req.params.id, function(err, foundMineral) {
    if (err) {
        console.log(err);
    } else {
        res.render("minerais/edit.ejs", {mineral:foundMineral});
    }
 })  ; 
    
});

// update
router.put("/:id", middlewareObj.isAdmin, upload.single('image'), function(req,res) {

 if (req.file) {
    Mineral.findById (req.params.id, function(err, mineral) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
    }
    //delete the file from cloudinary
    cloudinary.v2.uploader.destroy(mineral.imageId, function(err,result) {
        if(err) {
            req.flash("error",err.message);
            return res.redirect("back");
        }
    //Upload a new one
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err) {
            req.flash("error",err.message);
            return res.redirect("back");
        }
    // add cloudinary url for the same image to the mineral object under image propety
    req.body.image = result.secure_url;
    //add image public_id to animal object
    req.body.imageId = result.public_id;
     Mineral.findByIdAndUpdate(req.params.id, req.body, function (err, foundMineral) {
            if(err) {
                req.flash("error",err.message);
                res.redirect("back");
            } else {
                req.flash("success","Editado com sucesso");
                res.redirect("/minerais/"+req.params.id);
            }
    });
    });
    });
}); } else {
    
Mineral.findByIdAndUpdate(req.params.id, req.body, function (err, foundMineral) {
        if(err) {
            req.flash("error",err.message);
            res.redirect("back");
        } else {
            req.flash("success","Editado com sucesso");
            res.redirect("/minerais/"+req.params.id);
        }
});
}
});

// DELeTE
router.delete("/:id", middlewareObj.checkMineralOwnership, function(req,res) {
    //delete the file from cloudinary
    Mineral.findById (req.params.id, function(err, mineral) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
    }
    cloudinary.v2.uploader.destroy(mineral.imageId, function(err,result) {
        if(err) {
            req.flash("error",err.message);
            return res.redirect("back");
        }
    });
    });
    //delete mineral from db
   Mineral.findByIdAndRemove(req.params.id, function(err) {
       if (err) {
           console.log(err);
       } else {
           req.flash("success","Deletado com sucesso");
           res.redirect("/minerais");
       }
   }); 
    
});


// helper function for search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}




module.exports = router;