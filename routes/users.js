var express=require('express');
var router=express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Contact = require('../models/contact');


router.get('/register',function(req,res){
	res.render('register');
});

router.get('/home',function(req,res){
	// var username1 = "shobuj1995";
	var query = {};
	User.find(query, function(err, user){
		if(err) throw err;
		else{
			res.render('Home', {user_var: user});
		}
	});
	
});
router.get('/teacher',function(req,res){
	res.render('teacher');
});

router.get('/login',function(req,res){
	res.render('login');
});
router.get('/about',function(req,res){
	res.render('about');
});


router.get('/contact',function(req,res){
	var query = {};
	Contact.find(query, function(err, user){
		
		console.log("Contacts:-- ");
		console.log(user);

		if(err) throw err;
		else{
			res.render('contact', {contacts: user});
		}
	});
});


router.get('/index',function(req,res){
	res.render('index');
});
router.post('/register',function(req,res){
	console.log('Hello -- ');
	var name=req.body.name;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;
	var password2=req.body.password2;

	req.checkBody('name','name is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is required').isEmail();
	req.checkBody('username','Username is required').notEmpty();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);
	


	var errors=req.validationErrors();


	if(errors){
		res.render('register',{
			errors:errors

		});
	}else{
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password

		});

		User.createUser(newUser,function(err,user){
			if(err)throw err;
			console.log(user);	

		});
		req.flash('success_msg','you are registered and can login');
		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
  	console.log('login auth--');
  	User.getUserByUsername(username,function(err,user){
  		console.log(err);
  		if(err) throw err;
  		if(!user){
  			return done(null,false,{message:'Unknown User'});
  		}
  		// console.log(password);
  		// console.log('check');
  		// console.log(user.password);

  		User.comparePassword(password,user.password,function(err,isMatch){
  			// console.log('isMatch works --->');
  			if(err)throw err;
  			if(isMatch){
  				return done(null,user);
  			}else{
  				return done(null,false,{message: 'Invalid password'});
  			}
  		});
  	});
    
  }));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/users/login');
  });
router.get('/logout',function(req,res){
  req.logout();

  req.flash('success_msg','you are logged out');
  res.redirect('/users/login');

});
module.exports=router;