var express = require('express'),
    app = express.createServer(),
    port = process.env.PORT || 8888;
//    routes = "./routes.js";

app.configure(function(){
//    app.set('views', __dirname + '/views');
//    app.set('view engine', 'jade');
//    app.use(express.bodyParser());
//    app.use(express.cookieParser());
//    app.use(express.methodOverride());
//    app.use(app.router);
    app.use(express.static(__dirname + '/src'));
    //console.log(__dirname);
    app.set('views', __dirname + '/src/views');
    app.get('/vote/:id', function(req, res, next){
    	var id = req.params.id;
    	console.log("requested " + id);
    	res.render('index');
    });
//    app.use(express.static(__dirname + '/css'));
//    app.use(express.static(__dirname + '/img'));
//    app.use(express.static(__dirname + '/js'));
//    app.use(express.static(__dirname + '/lib'));
});
app.listen(port);