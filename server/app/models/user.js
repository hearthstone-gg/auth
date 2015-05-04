/*
	User Model
*/
var uuid = require('node-uuid');

var User = exports.User = function(options, mongoose) {
	var self = this;
	var Schema = mongoose.Schema;

	var userSchema = new Schema({
		bnet: {
			id: String,
			token: String,
			name: String
		},
		token: String
	});

	userSchema.methods.getDisplayName = function() {
		if (this.bnet.name) {
			name = this.bnet.name.split('#')[0];
		}
		return name.toLowerCase();
	}

	userSchema.methods.generateToken = function(cb){
		//TODO use bnet token in hash
		this.token = uuid.v4();
		this.save(function() {
			if (cb) { cb(); }
		});
	};

	var UserModel = mongoose.model('User', userSchema);

	return UserModel;
};