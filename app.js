// NPM PACKAGES
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Mineral      = require("./models/mineral"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override"),
    moment = require("moment");
    
    
require('dotenv').config();

// call routes
var commentRoutes    = require("./routes/comments"),
    mineraisRoutes = require("./routes/minerais"),
    indexRoutes      = require("./routes/index"),
    idRoutes  = require("./routes/identify");

// USE  CONFIGURATIONS
var urldb = process.env.DATABASEURL || "mongodb://localhost/minerais";
mongoose.connect(urldb);

moment.locale('pt-br');    
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //Testing porpouse delete and populate minerals


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware, add currentUser in all routes
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.moment = require("moment");
  next();
});

// USE ROUTES
app.use(indexRoutes);
app.use("/identificar", idRoutes);
app.use("/minerais", mineraisRoutes);
app.use("/minerais/:id/comments",commentRoutes);


// start server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("MinID server has started!!!");
});