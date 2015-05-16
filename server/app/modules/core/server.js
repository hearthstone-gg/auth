/*
	Depends on: Module

	Subscribes:
		modules:loaded - once modules are loaded, create the server

	Emits:
		server:configure - emitted when the app is ready to be configured by modules
			@arg app -- the express app instance
		server:configurePassport - emitted wehn the app is ready to bind passport config
			@arp passport - the passport instance
		server:routes - emitted when the app is ready to bind routes
			@arg app -- the express app instance
		server:genericRoutes - emitted when the app is ready to bind catch-all routes (eg. /*)
			@arg app - the express app instance
		server:ready - emitted when the server has been bound to the port
			#arg server -- the http server instance
*/
var http = require('http');
var https = require('https');
var express = require('express');
var util = require('util');
var passport = require('passport');
var fs = require('fs');
var path = require('path');


var Module = require('./module').Module;

var Server = exports.Server = function(options, events) {
	Module.call(this, options);
	//call parent constructor
	var self = this;

	var privateKey  = fs.readFileSync(path.join(__dirname, '../../../sslcert/localhost.key'), 'utf8');
	var certificate = fs.readFileSync(path.join(__dirname, '../../../sslcert/localhost.cert'), 'utf8');

	var credentials = {key: privateKey, cert: certificate};

	var app = express();
	var httpServer = http.createServer(app);

	events.on('modules:loaded', function(){
		//tell the other modules to configure the express app
		events.emit('server:configure', app, httpsServer);

		app.configure(function() {
			app.use(app.router);
		});

		events.emit('server:configurePassport', passport);

		//tell the modules other modules to bind their routes
		events.emit('server:routes', app, passport);

		events.emit('server:genericRoutes', app);

		var serverOptions = self.options.get('server');
		var httpsServer = https.createServer(credentials, app);
		//create servers
		httpServer.listen(serverOptions.port, function() {

			httpServer.on('request', function (req, res) {
				// TODO also redirect websocket upgrades
				res.setHeader('Location' , 'https://' + req.headers.host.replace(/:\d+/, ':' + serverOptions.sslPort) + req.url);
				res.statusCode = 302;
			});
			events.emit('server:insecureready', httpServer);
			self.log('Redirecting all traffic on ' + serverOptions.port + ' to ' + serverOptions.sslPort)
		});

		httpsServer.listen(serverOptions.sslPort, function() {
			self.log('Environment is ' + self.options.get('env') + ' - listening on port ' + serverOptions.sslPort);
			events.emit('server:ready', httpsServer);
		});
	});
};

util.inherits(Server, Module);