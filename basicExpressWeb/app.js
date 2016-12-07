var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){

	res.render('index', {title : 'Computer Not Working?'});
	// res.send('HELLO WORLD');
	// console.log('Hello World!');

});

app.get('/about', function(req,res){
	res.render('about');

});

app.get('/contact',function(req,res){
	res.render('contact');
});

app.post('/contact/send', function(req,res){
	var transporter = nodemailer.createTransport({
			service:'Gmail',
			auth : {
				user: 'joosangkim1@gmail.com',
				pass: 'joosang!23'
			}
		});

	//mail option
	var mailOptions = {
		from: 'joosangkim <joosangkim1@gmail.com>',
		to:'joosangkim1@gmail.com',
		subject:'Website submission',
		text:'You have blah blah... Name:'+req.body.name+'Email : '+req.body.email+'\nmessage : '+req.body.message,
		html:'<p>email html</p>'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			res.redirect('/');

		}else{
			console.log('Message sent : '+info.response);
			res.redirect('/');
		}
	}
	);
});

app.listen(3000);
console.log('Server is running on  port 3000...');