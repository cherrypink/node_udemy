var express= require('express');
var path= require('path');
var bodyParser= require('body-parser');
var exphbs= require('express-handlebars');
var expressValidator= require('express-validator');
var session= require('express-session');
var flash= require('connect-flash');
var multer= require('multer');
var upload= multer({dest:'./public/images/portfolio'});

//Route files
var routes = require('./routes/index');
var admin = require('./routes/admin');

//Init App
var app = express();

//body parser middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Handle session
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true
}));

//Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length){
			formParam +='[' + namespace.shift() +']';
		}
		return {
			param: formParam,
			msg  : msg,
			value : value
		};
	}
}));

//public folder
app.use(express.static(path.join(__dirname, 'public')));

//view Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

//connect flahs
app.use(flash());

app.use('/',routes);
app.use('/admin', admin);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('server started on port'+app.get('port'));
});