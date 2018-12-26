var Comment     = require("../models/comment"),
Mineral      = require("../models/mineral");
var middlewareObj = {};

middlewareObj.checkCommentOwnership = function (req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               req.flash("error","Erro! Contatar administrador");
               res.redirect("back");
           }  else {
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error","Nao possui permissao");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error","Nao possui permissao");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Você precisa estar logado!");
    res.redirect("/login");
};

middlewareObj.checkMineralOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Mineral.findById(req.params.id, function(err, foundMineral){
           if(err || !foundMineral){
               req.flash("error", "Ocorreu algum erro, reporte ao admin");
               res.redirect("back");
           }  else {
            if(foundMineral.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error","Nao possui permissão");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error","Você precisa ser o criador para realizar a ação!");
        res.redirect("back");
    }
};

middlewareObj.isAdmin = function(req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    req.flash("error","Você precisa ser Administrador!");
    res.redirect("/minerais");
};

module.exports = middlewareObj;