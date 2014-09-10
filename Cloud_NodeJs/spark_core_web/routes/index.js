/****
 * Description: router for web server
 * Dependency:
 * Modification: 2014/05/04-pdli: 1st merge with LC
 */
var config = require("../../configs/config");
var user = require('./user'); //user management
var device = require('./device'); //device management
var electric = require('./electric');  //electric management
var ifttt = require('./ifttt'); //ifttt management
var stub = require('./ifttt_dataInject');
//var post = require('./post'); //Blog management



//Initialize it once use app.js/webServerOnly
if (true == config.isWebServerOnly) {
    var dbConnect = require("../../public/DB");
    var DBconnect = new dbConnect();
    DBconnect.construct();
}

function index (req, res) {
    //res.render('index');
    res.render('index', {title: 'Paratu', layout: "layout/MainPage_layout"});
}

function notify (req, res) {
    res.render('notify/notify', {title: 'Notify', layout: "layout/generic_layout"});
}

function authentication(req, res, next) {
	if (!req.session.user) {
		req.session.error='请先登陆';
		return res.redirect('/login');
	}
	next();
}

function notAuthentication(req, res, next) {
	if (req.session.user) {
		req.session.error='已登陆';
		return res.redirect('/');
	}
	next();
}

function resetPass(req, res) {
    console.log(req);
    console.log(req.query.name);
    res.locals.user = {name: req.query.name, email: req.query.email};
    res.render('sign/reset_pass', {title: "resetPassword", layout: "layout/generic_layout" });
}

module.exports = function (app) {

    //main Route
    app.get('/', index);
    app.get('/notify', notify);

    /**************** Account Management ****************/
	//app.all('/login|/reg', notAuthentication);
	app.get('/signin',user.login);
	app.post('/signin',user.doLogin);
	
	app.get('/logout', authentication);
	app.get('/logout',user.logout);
	
	app.get('/reg',user.reg);
	app.post('/reg',user.doReg);
    app.get("/u/:username",user.user); //用户的主页
    app.get('/activePass', user.activeAccount);

    app.get('/forgetPass',  function(req, res){
        res.render('sign/forget_pass', {title: 'findPassword', layout:"layout/generic_layout"});    });
    app.post('/fgtPass', user.ajaxfgtPass);
    app.post('/forgetPass', user.forgetPassword);

    app.get('/resetPass', resetPass);
    app.post('/resetPass',user.resetPassword);

    app.get('/changePass',  function(req, res){
        res.render('sign/change_pass', {title: 'changePassword', layout:"layout/generic_layout"});
    });
    app.post('/changePass', user.changePassword);

    /*// AJAX //*/
    app.post('/checkusername', user.ajaxisUserExists);
    app.post('/checkemail', user.ajaxisEMailExists);
    app.post('/trylogin', user.ajaxtryLogin);

    /**************** Device Management  ****************/
    app.get('/dashboard', function (req, res) {
        res.redirect('/dashboard/devices')
    });
    app.get('/dashboard/devices', user.findAllDevicesByUser);

    /*// AJAX //*/
    app.post('/updatedevices', device.ajaxupdate);

    /**************** Show Elec_usage Management ****************/

    app.get('/dashboard/elec', user.getDevicesElecUsage);

    app.post('/device/showElec', function(req, res){

        electric.showElec(req, res);
        /*var dataAccum = { "xaxisValue": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47],
         "xaxisType":"小时" ,
         "yaxisValue":
         {
         "设备一":{
         "name": "设备五",
         "lineWidth": 1,
         "marker": {"radius": 3, "symbol": 'circle'},
         "data": [1,3,3,4,4,5,9,14,16,19,20,24,26,27,27,29,29,32,38,43,51,53,58,60,61,63,63,64,64,65,69,74,76,79,80,84,86,87,87,89,89,92,98,103,111,113,118,120,1,3,3,4,4,5,9,14,16,19,20,24,26,27,27,29,29,32,38,43,51,53,58,60,61,63,63,64,64,65,69,74,76,79,80,84,86,87,87,89,89,92,98,103,111,113,118,120,1,3,3,4,4,5,9,14,16,19,20,24,26,27,27,29,29,32,38,43,51,53,58,60,61,63,63,64,64,65,69,74,76,79,80,84,86,87,87,89,89,92,98,103,111,113,118,120]
         },
         "设备二":{
         "name": "设备六",
         "lineWidth": 1,
         "marker": {"symbol": 'circle'},
         "data": [1,2,0,1,0,1,,4,5,2,3,1,4,2,1,0,2,0,3,6,5,8,2,5,2,1,2,0,1,0,1,4,5,2,3,1,4,2,1,0,2,0,3,6,5,8,2,5,2]
         }
         }
         };

         var dataOnTime = {
         "xaxisValue": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41],
         "xaxisType":"小时" ,
         "yaxisValue":
         {"设备一":{
         "name": "设备二",
         "marker": {"symbol": 'square'},
         "data": [1,2,0,1,0,1,4,5,2,3,1,4,2,1,0,2,0,3,6,5,8,2,5,2,1,2,0,1,0,1,4,5,2,3,1,4,2,1,0,2,0,3,6,5,8,2,5,2]
         },
         "设备二":{
         "name": "设备三",
         "marker": {"symbol": 'square'},
         "data": [11,12,0,11,0,11,14,15,2,3,1,4,2,1,0,2,0,3,6,5,8,2,5,2,1,2,0,1,0,1,4,5,2,3,1,4,2,1,0,2,0,3,6,5,8,2,5,2]
         }}
         };


         var datas = {elecAccum: dataAccum, elecOnTime: dataOnTime};

         res.send(datas);*/
    });

    /******************* IFTTT Management ****************/
    app.get('/dashboard/ifttt', ifttt.loadMainPage);

    app.get('/dashboard/editRecipe', ifttt.renderEditRecipePage);
    app.post('/dashboard/editRecipe', ifttt.editRecipe);

    app.get("/dashboard/addRecipe", ifttt.redirectAddRecipe);
    app.post("/dashboard/addRecipe", ifttt.createRecipe);

    /*// AJAX //*/
    app.post("/dashboard/getSelectedRecipeInfo", ifttt.ajaxSelectedGetRecipeInfo);

    app.get("/dashboard/p_t_editDateTimerRec", function(req, res){
        res.render('application/ifttt_partials/p_t_editDateTimerRec');
    });

    app.get("/dashboard/p_t_editOthersRec", function(req, res){
        res.render('application/ifttt_partials/p_t_editOthersRec');
    });

    app.get("/dashboard/p_t_editTimer", function(req, res){
        res.render('application/ifttt_partials/p_t_editTimer');
    });
    app.get("/dashboard/p_t_editWeath", function(req, res) {
        res.render("application/ifttt_partials/p_t_editWeath");
    });

    app.post("/dashboard/p_r_switchDevice", function(req, res) {
        res.render("application/ifttt_partials/p_r_switchDevice", {coreId: req.body.id, deviceName: req.body.name});
    });
    app.get("/dashboard/p_a_editEmail", function(req, res) {
        console.log("Please add new webpage for editEmail");
    });

    /******************* Debut Command ****************/
    //debug
    app.get("/test", function(req, res){
        res.render('application/test', {layout: 'layout/dashboard_layout'});
    });

    //electric
	//app.get("/electric/presentElectric",electric.presentElectric);
	
    /**
    //app.get('/device/add',device.deviceAdd);
	//app.post('/device/add',device.doDeviceAdd);

	app.post('/search',device.search);
    //devices
    app.get("/device/:id",device.read);
	app.get('/post/publish',post.publish);
	app.post('/post/publish',post.savePost);
	


	app.all('/post',post.post); 
	app.get('/post/:id',post.getOnePost); 
	app.post('/post/addComment',post.addComment);
//	app.all('/edit/:user/:title', authentication);
	app.get('/edit/:user/:title',post.edit); 
	//app.get('/device/:device',device.deviceAdd);
     **/
}
