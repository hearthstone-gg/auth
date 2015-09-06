/*
	User Model
*/
var conf = require('hs.gg-config').get('local');


var User = exports.User = function(options, mongoose) {
	
	return UserModel = conf.services.models.user(mongoose);
};