/*
	Depends on: Module, Server

	SERVER EVENTS
	Emits:
		
	Subscribes:
		server:routes - binds route for local
		server:configurePassport - binds route for local
*/
var util = require('util');
var Module = require('../core/module').Module;

var BattleNet = exports.Bnet = function(options, events, models) {
	//call parent constructor
	Module.call(this, options);
	var self = this;
	//cache the even emitter so we can access it later
	self.events = events;

	//get the options from the config file, and store them
	var authOptions = self.options.get('auth');
	self.authOptions = authOptions;
	self.userModel = models.user;

	events.on('server:routes', function(app, passport) {
		self.bindStrategies(app, passport);
	});
	events.on('server:routes', function(app, passport) {
		self.bindStrategies(app, passport);
	});

	events.on('server:configurePassport', function(passport) {
		self.configurePassport(passport);
	});
};

util.inherits(BattleNet, Module);

BattleNet.prototype.configurePassport = function(passport) {
	var self = this;
	var User = self.userModel;
	var configAuth = self.authOptions;

	var BnetStrategy = require('passport-bnet').Strategy;

	// =========================================================================
	// FACEBOOK ================================================================
	// =========================================================================
	passport.use(new BnetStrategy({

			clientID: configAuth.bnetAuth.clientID,
			clientSecret: configAuth.bnetAuth.clientSecret,
			callbackURL: configAuth.bnetAuth.callbackURL,
			passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

		},
		function(req, token, refreshToken, profile, done) {
			// asynchronous
			process.nextTick(function() {
				

				// check if the user is already logged in
				if (!req.user) {

					User.findOne({
						'bnet.id': profile.id
					}, function(err, user) {
						if (err)
							return done(err);
						if (user) {

							// if there is a user id already but no token (user was linked at one point and then removed)
							if (!user.bnet.token) {
								user.bnet.token = token;
								user.bnet.id = profile.id;
								user.bnet.name = profile.battletag;
								
								user.save(function(err) {
									if (err) {
										throw err;
									}
									done(null, user);
								});
								return;
							}

							return done(null, user); // user found, return that user
						} else {
							// if there is no user, create them
							var newUser = new User();

							newUser.bnet.id = profile.id;
							newUser.bnet.token = token;
							newUser.bnet.name = profile.battletag;

							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}
					});

				} else {
					// user already exists and is logged in, we have to link accounts
					var user = req.user; // pull the user out of the session

					user.bnet.id = profile.id;
					user.bnet.token = token;
					user.bnet.name = profile.battletag;

					user.save(function(err) {
						if (err)
							throw err;
						return done(null, user);
					});

				}
			});

		}));
}

/*
 Add additional methods on the prototype below, so you can create methods for handling routes
 or anything else this module needs to do
*/
BattleNet.prototype.bindStrategies = function(app, passport) {
	//login
	app.get('/auth/bnet', passport.authenticate('bnet', {
		// scope: 'email'
	}));

	// handle the callback after bnet has authenticated the user
	app.get('/auth/bnet/callback',
		passport.authenticate('bnet', {
			successRedirect: '/user',
			failureRedirect: '/'
		}));

	//connecting
	app.get('/connect/bnet', passport.authorize('bnet', {
		// scope: 'email'
	}));

	// handle the callback after bnet has authorized the user
	app.get('/connect/bnet/callback',
		passport.authorize('bnet', {
			successRedirect: '/user',
			failureRedirect: '/'
		}));

	//unlink
	app.get('/unlink/bnet', function(req, res) {
		var user = req.user;
		user.bnet.token = undefined;
		user.save(function(err) {
			res.redirect('/');
		});
	});
};