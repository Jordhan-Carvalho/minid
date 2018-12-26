var express = require("express");
var router = express.Router({mergeParams: true});
var Mineral = require("../models/mineral");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware/index");


// Comments new
router.get("/new", middlewareObj.isLoggedIn, function(req,res) {
    Mineral.findById(req.params.id, function(err, foundMineral){
       if (err) {
        console.log(err);   
       } else {
      res.render("comments/new.ejs", {mineral:foundMineral}); 
       }
    });
});


// Comments create
router.post("/", middlewareObj.isLoggedIn, function(req,res) {
 Mineral.findById(req.params.id, function(err, foundMineral){
       if (err) {
        req.flash("error","Contatar administrador");
        console.log(err);   
       } else {
           Comment.create(req.body.comment, function (err, comment) {
               if (err) {
                req.flash("error","Contatar administrador");
                   console.log(err);
               } else {
                // add username and id to comments
                comment.author.username = req.user.username;
                comment.author.id = req.user._id;
                //save comments
                comment.save();
                   foundMineral.comments.push(comment);
                   foundMineral.save();
                   req.flash("success","Criado com sucesso!");
               res.redirect('/minerais/' + foundMineral._id);
           }
        });
       }
   });
});

// EDIT COMMENT
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function (req,res){
 Mineral.findById(req.params.id, function(err, foundMineral) {
     if (err || !foundMineral) {
        req.flash("error", "Mineral nao encontrado");
        return res.redirect("back");
       }
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
            req.flash("error","Contatar administrador");
            console.log(err);
           } else {
           res.render("comments/edit.ejs", {mineral_id:req.params.id, comment:foundComment}); 
           }
       });
 });
});

// UPDATE COMMENT
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req,res) {
 Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment , function (err, oldComment){
  if (err) {
   req.flash("error","Contatar administrador");
   console.log(err);
  } else {
   req.flash("success","Editado com sucesso!");
   res.redirect("/minerais/"+ req.params.id);
  }
 });
});


router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req,res) {
 Comment.findByIdAndRemove(req.params.comment_id, function (err){
  if(err) {
   req.flash("error","Contatar administrador");
   console.log(err);
  } else{
   req.flash("success","Deletado com sucesso!");
   res.redirect("/minerais/"+ req.params.id);
  }
 });
});




module.exports = router;