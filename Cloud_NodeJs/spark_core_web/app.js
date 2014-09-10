/**
 * Description: Module dependencies.
 * Dependency:  Launch cloudMain.js instead of app.js
 * Modification: 2014/05/04 - LPD: 1st merge with LC
 */
var express = require('express');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var SessionStore = require("session-mongoose")(express);
var partials = require('express-partials');

var routes = require('./routes');
var	engine=require('./expand_modules/ejs');
var config = require("../configs/config");

var app = express();
var server; //definition for http server

// app configurations
app.set('port', process.env.PORT || 3000);

/***the order of these config is depended***/
app.configure(function(){
    /**add for static file in express**/
    app.use(express.static(path.join(__dirname, 'public')));

    /**configs for view & engine & layout**/
    app.set('views', path.join(__dirname, 'views'));
    //html <---> ejs
    app.engine('.ejs', engine);
    app.set('view engine', 'ejs');
    // app.set('view options', { layout:'layout.html' });
    //app.set('layout', 'layout');
    // app.locals._layoutFile='layout';
    //app.set('view engine', 'ejs');
    //layout middleware
    app.use(partials());

    /**configs for what ?**/
    app.use(express.logger('dev')); //log for express
    app.use(express.favicon()); //set default path for your web icon
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.bodyParser()); //parse for all requestion
    app.use(express.methodOverride()); //override method, support methods like put, delete, etc.

    /**configs for cookie**/
    app.use(express.cookieParser('Paratu secret')); //signature for res.cookie

    /**configs for session**/
    //add for session
    //app.use(express.cookieSession({secret : 'fens.me'}));
    /*app.use(express.session({
        secret : settings.cookieSecret,
        store: new Mongostore({
            db: settings.db
        }),
        cookie: { maxAge: 900000 }
    }))*/

    //add for session 提供会话支持
    app.use(express.session({
        secret : config.secret,
        store: new SessionStore({
            url: config.sessionHost,
            interval: 120000
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24}//1 day
    }));

    app.use(function(req, res, next){
        res.locals.recipeSelected = req.session.recipeSelected;
        res.locals.recipeArray = req.session.recipeArray;
        res.locals.user = req.session.user;
        res.locals.lostuser = req.session.lostuser;
        res.locals.url = req.url;
       // res.locals.recipts = ;
        var err = req.session.error, msg = req.session.success;
        delete req.session.error;
        delete req.session.success;
        res.locals.message = '';
        if (err) res.locals.message = '<div class="alert alert-danger">' + err + '</div>';
        if (msg) res.locals.message = '<div class="alert alert-success">' + msg + '</div>';
        next();
    });

    /**The last line is mandatory**/
    app.use(app.router);


});

routes(app);

server = http.createServer(app);

// development only
/*if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}*/

if(!module.parent){
    server.listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
}

module.exports = server;

