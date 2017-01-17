var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//User Schema
var UserSchema = mongoose.Schema({
	username: {
		type:String
	},
	email:{
		type: String
	},
	password:{
		type:String,
		bcrypt: true
	},
	type:{
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

// Get User By Id 
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// Get User By  Username
module.exports.getUserByUsername = function (username, callback){
	var query = {'username': username};
	User.findOne(query, callback);
} 

//Compare password
module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) throw err;
		callback(null, isMatch);
	});
}

//Create Student User
module.exports.saveStudent = function(newUser, newStudent, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err)throw err;

		//set hash
		newUser.password = hash;
		console.log("student is being saved");
		async.parallel([newUser.save, newStudent.save], callback);
	});
}

//Create Instructor user
module.exports.saveInstructor = function(newUser, newInstructor, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err)throw err;

		//set hash
		newUser.password = hash;
		console.log("Instructor is being saved");
		async.parallel([newUser.save, newInstructor.save], callback);
	});
}
