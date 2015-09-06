/*
	User Model
*/
var conf = require('hs.gg-config').get('local');

var User = exports.User = function(options, mongoose) {
	var self = this;
	
	return conf.services.models.user;
};