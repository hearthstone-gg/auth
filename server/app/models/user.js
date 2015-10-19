/*
	User Model
*/
var config = require('hs.gg-config').get('local');


var User = exports.User = function(options, mongoose) {
	
	return mongoose.model('User', config.models.user(mongoose));
};