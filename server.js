var express = require('express'),
    app = express.createServer();
//    routes = "./routes.js";

app.configure(function(){
//    app.set('views', __dirname + '/views');
//    app.set('view engine', 'jade');
//    app.use(express.bodyParser());
//    app.use(express.cookieParser());
//    app.use(express.methodOverride());
//    app.use(app.router);
    app.use(express.static(__dirname + '/src'));
//    app.use(express.static(__dirname + '/css'));
//    app.use(express.static(__dirname + '/img'));
//    app.use(express.static(__dirname + '/js'));
//    app.use(express.static(__dirname + '/lib'));
});
app.listen(8888);