/*
	Depends on: Module, Server

	SERVER EVENTS
	Emits:
		
	Subscribes:
		server:routes - binds route for auth
*/
var util = require('util');
var Module = require('./core/module').Module;

var passport = require('passport');
var flash    = require('connect-flash');
var express = require('express');

var Auth = exports.Auth = function(options, events, models) {
	//call parent constructor
	Module.call(this, options);
	var self = this;

	//cache the even emitter so we can access it later
	self.events = events;

	//get the options from the config file, and store them as authOptions for access later
	var authOptions = self.options.get('auth');
	self.authOptions = authOptions;

	self.userModel = models.user;

	events.on('server:routes', function(app,passport){
		app.set('views', process.cwd() + '/server/views/');

		app.get('/user', function(req,res){
			self.sendUser(req,res);
		});

		// LOGOUT ==============================
		app.get('/logout', function(req, res) {
			req.logout();
			res.redirect('/');
		});
	});

	events.on('server:configure', function(app){
		// set up our express application
		app.use(express.cookieParser()); // read cookies (needed for auth)
		app.use(express.bodyParser()); // get information from html forms
		app.set('view engine', 'ejs'); // set up ejs for templating

		// required for passport
		app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
		app.use(passport.initialize());
		app.use(passport.session()); // persistent login sessions
		app.use(flash()); // use connect-flash for flash messages stored in session
	});

	events.on('server:configurePassport', function(passport) {
		self.configurePassport(passport);
	});

	//bind to other events from core or from other modules
};

util.inherits(Auth, Module);

Auth.prototype.configurePassport = function(passport) {
	var self = this;
	var User = self.userModel;

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};

Auth.prototype.sendUser = function(req,res) {
	var events = this.events;
	if (req.user) {
		req.user.generateToken(function() {
			res.json({
				displayName: req.user.getDisplayName(),
				token: req.user.token
			});

			events.emit('active', {user: req.user.getDisplayName()});
		});
	} else {
		res.json({error: true});
	}
}