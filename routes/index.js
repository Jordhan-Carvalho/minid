var express = require("express");
var router = express.Router();
var middlewareObj = require("../middleware/index");
var passport = require("passport"),
User        = require("../models/user"),
Mineral = require("../models/mineral"),
async = require("async"),
nodemailer = require("nodemailer"),
crypto = require("crypto");


router.get("/", function(req,res) {
    
 res.render("landing.ejs");   
});

// Contribution routes
router.get("/contribuir", function(req,res) {
 res.render("contribuir/index.ejs");   
});

router.get("/contribuir/guia", function(req,res) {
 res.render("contribuir/guia.ejs");   
});


// =============================
// AUTH ROUTES
// =============================
// show register form
router.get("/register", function(req, res) {
   res.render("authentication/register.ejs"); 
});


router.post("/register", function(req, res) {
   var newUser = new User({
       username: req.body.username,
       firstName: req.body.firstName,
       lastName: req.body.lastName,
       avatar: req.body.avatar,
       email:req.body.email
   });

   if (req.body.admin==process.env.ISADMIN) {
       newUser.isAdmin= true;
   }
   
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // modificando a error msg
            if (err.name=='UserExistsError') {
             req.flash("error","Usuario existente!");
             console.log(err);
            return res.redirect('/register');
            } else {
            req.flash("error",err.message);
            console.log(err);
            return res.redirect('/register');
            }
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Registrado com sucesso! Seja bem-vindo "+user.username);
           res.redirect("/minerais");
        });
    });
    
});
// login
router.get("/login", function(req, res) {
   res.render("authentication/login.ejs"); 
});
    
router.post("/login", passport.authenticate("local", {
    successRedirect: "/minerais",
    failureRedirect: "/login"
}) ,function(req, res) {
});

//logout
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success","Deslogado com sucesso!");
   res.redirect("/minerais");
});



//User profile
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err,foundUser) {
        if (err || !foundUser) {
            req.flash("error","User nao encontrado");
            res.redirect("back");
        } else {
            Mineral.find().where('author.id').equals(foundUser._id).exec(function(err, foundMinerais) {
                  if(err|| !foundMinerais) {
                    req.flash("error", "Algo deu errado.");
                    return res.redirect("/");
                  }
                  res.render("authentication/users.ejs", {user: foundUser, minerais: foundMinerais});
            });
        }
        
        
    });
});

//RESET PASSWORD CONFIG

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot.ejs');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
     
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'Não existe usuário com este e-mail.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'bianca.jordhan@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'bianca.jordhan@gmail.com',
        subject: 'MinID Resetar Senha',
        text: 'Você está recebendo isso porque você (ou outra pessoa) solicitou a redefinição da senha de sua conta..\n\n' +
          'Por favor, clique no seguinte link ou cole no seu navegador para completar o processo:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'Se você não solicitou isso, ignore este e-mail e sua senha permanecerá inalterada..\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'Um e-mail foi enviado para ' + user.email + ' com instruções.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});
//MAKE THE NEW PASS FORM
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Token de resetar a senha é invalido ou expirou.');
      return res.redirect('/forgot');
    }
    res.render('reset.ejs', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Token de resetar a senha é invalido ou expirou.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "As senhas não coincidem.");
            return res.redirect('back');
        }
      });
    },
    //EMAIL CONFIRMING PASSWORD CHANGE
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'bianca.jordhan@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'bianca.jordhan@gmail.com',
        subject: 'Sua senha foi mudada',
        text: 'Olá,\n\n' +
          'Esta é uma confirmação de que a senha da sua conta ' + user.email + ' foi modificada.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Sucesso! Sua senha foi modificada.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/minerais');
  });
});

  


module.exports = router;