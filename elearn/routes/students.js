var express = require('express');
var router = express.Router();

var Class= require('../models/class');
var Student = require('../models/student');
var User = require('../models/user');

router.get('/classes', function(req,res,next){
	console.log("studentS!!!");
	console.log(req.user);
	Student.getStudentByUsername(req.user.username, function(err, student){
		if(err) throw err;
		res.render('students/classes', {student : student});
	});
});

module.exports = router;