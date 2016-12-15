var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' });
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


router.get('/show/:id', function(req, res, next) {
	var posts = db.get('posts');

	posts.findById(req.params.id, function(err, post){
		res.render('show',{
  			'post' : post
  		});
	});
  
});


router.get('/add', function(req, res, next) {
	var categories = db.get('categories');

	categories.find({},{},function(err, categories){
		res.render('addpost',{
  			'title' : 'Add Post',
  			'categories' : categories
  		});
	});
  
});

router.post('/add', upload.single('mainimage'),function(req, res, next) {
	//get Form values
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date= new Date();
	var mainimage ='';
	//Check Image Upload
	if(req.file){
		mainimage = req.file.filename;
		console.log(mainimage);
		console.log(req.file.filename);
		console.log(req.file);
	}  else{
		mainimage = 'noimage.jpg'
	}

	//Validator
	req.checkBody('title', 'Title filed is required.').notEmpty();
	req.checkBody('body', 'Body field is required.').notEmpty();

	//check errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addpost' ,{
			"errors" : errors
			// "title"  : title,
			// "body"   : body
		});
	}else {
		var posts = db.get('posts');
		posts.insert({
			"title":title,
			"body" : body,
			"category" : category,
			"date" : date,
			"author" : author,
			"mainimage" : mainimage
		}, function(err, post){
			if(err){
				res.send(err);
			}else{
				req.flash('success', 'Post Added');
				res.location('/');
				res.redirect('/');
			}
		})

	}
});

router.post('/addcomment', function(req, res, next) {
	//get Form values
	var name = req.body.name;
	var email = req.body.email;
	var body = req.body.body;
	var postid = req.body.postid; //hidden field
	var commentDate = new Date();
	

	//Validator
	req.checkBody('name', 'name filed is required.').notEmpty();
	req.checkBody('email', 'email filed is required.').notEmpty();
	req.checkBody('email', 'email filed is not a currect form.').isEmail();
	req.checkBody('body', 'body filed is required.').notEmpty();



	//check errors
	var errors = req.validationErrors();

	if(errors){
		var posts = db.get('posts');
		posts.findById(postid, function(err, post){
			res.render('show' ,{
			"errors" : errors,
			"post" : post
			// "title"  : title,
			// "body"   : body
		});

		});
		
	}else {
		var comment = {
			"name":name,
			"email" : email,
			"body" : body,
			"commentDate" : commentDate
		}

		var posts = db.get('posts');

		posts.update({
			"_id":postid
		}, {
			$push:{
				"comments" : comment
			}
		}, function(err, doc){
			if(err){
				throw err;
			}else{
				req.flash('success', 'comment added');
				res.location('/posts/show/'+postid);
				res.redirect('/posts/show/'+postid);
			}
		})

	}
});



module.exports = router;
