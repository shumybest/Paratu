/*
 Function: User Management(account)
 * */

var config = require("../../configs/config");
var mail = require("../../public/Mail");
var crypto = require("../../public/Crypto");
var redirect = require("../../public/Redirect");

//load user model
var userModel = require("../../models/userModel");
var deviceModel = require("../../models/deviceModel");

//User Login
exports.login = function (req, res) {
    if (req.cookies.remember) {
        console.log(req.cookies.remember);
        req.session.user = req.cookies.remember;
    }

    if(req.session.user != undefined) {
        res.redirect("/dashboard");
    }
    res.render("sign/signin", {title: "User_Login_Web", layout: "layout/generic_layout"});
};

exports.doLogin = function (req, res) {
    var user_info = {name: req.body.username, password: req.body.password};
    userModel.doLogin( req.body, function (result) {
        if (result && result == "input empty") {
            req.session.error = "用户名或密码不能为空";
            return redirect.response("/signin", "", res);
        } else if (result == "error") {
            req.session.error = "用户名或密码错误";
            return redirect.response("/signin", "", res);
        } else if (result == "can login") {
            req.session.user = user_info;
            if("on" == req.body.rememberme) {
                res.cookie("remember", req.session.user, {maxAge: 1000 * 60 * 60 * 24*7})
            }
            return redirect.response("dashboard", "", res);
        } else {
            return redirect.response("/signin", "", res);
        }
    });
};

exports.reg = function (req, res) {
    res.render("sign/signup", {title: "User_Register_Web", layout: "layout/generic_layout"}); //, regInfo: {error: "Insufficient information~", email: "pdl@123.com" }
};


exports.doReg = function (req, res) {
    userModel.doReg( req.body, function (result) {
        if (result == "input empty") {
            req.session.error = "用户名或密码或邮箱不能为空";
            redirect.response("/reg", "", res);
        } else if (result == "email format error") {
            req.session.error = "邮箱格式错误";
            redirect.response("/reg", "", res);
        } else if (result == "username error") {
            req.session.error = "用户名只能使用0-9,a-z,A-Z";
            redirect.response("/reg", "", res);
        } else if (result == "username length error") {
            req.session.error = "用户名至少需要5个字符";
            redirect.response("/reg", "", res);
        } else if (result == "have used") {
            req.session.error = "用户名或邮箱已经被使用";
            redirect.response("/reg", "", res);
        } else if (result == "error") {
            req.session.error = "注册失败";
            // res.writeHead(404);
            // res.end();
            redirect.response("/reg", "", res);
        } else if (result == "success") {
            //send an email
            var password = crypto.encrypt(req.body.password, config.secret);
            mail.sendActiveMail(req.body.email, password, req.body.username);
            req.session.success = "激活邮件已发送至注册邮箱，请点击邮件中的链接来激活您的帐号";
            res.redirect("signin");

            //res.render("sign/signup", { title: "Signup successful", layout: "layout/generic_layout" });
            /* res.render("sign/signup", { title:"Signup successful",
             success: "欢迎加入 " + config.name + "！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。", layout: "layout/generic_layout"
             })*/
        }
    });
};

//User LogOut
exports.logout = function (req, res) {
    res.clearCookie("remember");
    delete req.session.user;
    req.session.user = null;
    res.redirect("/");
};

exports.activeAccount = function (req, res) {
    userModel.doActiveCount( req.query, function (result) {
        if (result == "info error") {
            req.session.error = "信息有误，帐号无法被激活";
            redirect.response("/reg", "", res);
        } else if (result == "account had been active") {
            req.session.error = "帐号已经是激活状态";
            redirect.response("/signin", "", res);
        } else if (result == "error") {
            req.session.error = "激活失败";
            redirect.response("/reg", "", res);
        } else if (result == "success") {
            req.session.success = "帐号已被激活，请登录";
            redirect.response("/signin", "", res);
        }
    });
};

exports.changePassword = function (req, res) {
    userModel.doChangePassword( req.body, function (result) {
        if (result == "input empty") {
            req.session.error = "密码不能为空";
            redirect.response("/changePass", "", res);
        }  else if (result == "login error") {
            req.session.error = "用户密码不匹配";
            redirect.response("/changePass", "", res);
        } else if (result == "success") {
            req.session.success = "密码已更改";
            delete req.session.user;
            req.session.user = null;
            redirect.response("/signin", "", res);
        }
    });
};

exports.resetPassword = function (req, res) {
    userModel.doResetPassword( req.body, function (result) {
        if (result == "input empty") {
            req.session.error = "访问非法链接...";
            redirect.response("/notify", "", res);
        } else if (result == "email format error") {
            req.session.error = "访问非法链接...邮箱格式错误";
            redirect.response("/notify", "", res);
        } else if (result == "error") {
            req.session.error = "重置密码失败,请重新激活邮箱密码重置链接";
            redirect.response("/notify", "", res);
        } else if (result == "success") {
            req.session.success = "密码已重置,请重新登录";
            redirect.response("/signin", "", res);
        }
    });
};

exports.forgetPassword = function(req, res){
    userModel.doForgetPassword( req.body, function(result, user) {
       if(result == "success") {
           //send email & redirect to notify page
           //var password = crypto.encrypt(req.body.password, config.secret);
           mail.sendResetPassMail(req.body.email, user.password, user.name);
           req.session.success = "重置密码邮件已发送至注册邮箱，请点击邮件中的链接来激活您的帐号";
           redirect.response("notify", "", res);
       } else {
           req.session.error = "用户填写信息不正确，请核实" + result;
           redirect.response("/notify", "", res);
       }
    });
}

exports.user = function (req, res) {
    res.render("application/electrical_usage", {title: "Display", layout: "layout/dashboard_layout"});
    /*userModel.doFindAll(userModelDB,req.params,function(result){
     if(result.response=="success"){
     if(req.query.p){
     result.pageInfo["num"] = req.query.p<1?1:req.query.p;
     }

     console.log(result.pageInfo);
     return res.render("user", {
     devices:result.info,
     page:result.pageInfo
     });
     }else if(result.response=="error"){
     req.session.error = "用户不存在";
     return res.redirect("/");
     }
     });*/
};

exports.ajaxfgtPass = function(req, res) {
    var query_doc = req.body;
    userModel.isFinded(userModel.modelDB,query_doc, function(err, result){
            console.log(result);
            if(result) {
                res.send("existed");
            } else {
                res.send("not finded");
            }
        }
    );
};


exports.ajaxisUserExists = function (req, res) {
    var query_doc = {name: req.body.username};
    userModel.isFinded(userModel.modelDB, query_doc, function (err, result) {
        if(result) {
            res.send("success");
        } else {
            res.send("not exist");
        }
    });
}

exports.ajaxisEMailExists = function (req, res) {
    var query_doc = {email: req.body.email};
    userModel.isFinded(userModel.modelDB, query_doc, function (err, result) {
        if(result) {
            res.send("success");
        } else {
            res.send("not exist");
        }
    });
}

exports.ajaxtryLogin = function (req, res) {
    userModel.doLogin( req.body, function (result) {
        res.send(result);
    });
}

exports.getDevicesElecUsage = function(req, res){
    if(req.session.user != undefined) {
        var request = {username: req.session.user.name};
        deviceModel.doFindAll( request, function(result){
            var _ = "";
            if (result.info.length != 0) {
                var index;
                console.log("The number of devices is:" + result.length);
                for (index in result.info) {
                    _ += '<option value='+ result.info[index].coreid + ' label='+result.info[index].devicename +'>' + '</option>';
                }
            }
            res.render('application/electrical_usage', {title: "Display electrical usage", layout: 'layout/dashboard_layout', devicelist: _});
        });
    } else {
        res.redirect("/signin");
    }
}

exports.findAllDevicesByUser = function(req, res) {
    if(req.session.user != undefined) {
        var request = {username: req.session.user.name};
        deviceModel.doFindAll( request, function(result){
            var _ = "";
            if (result.info.length != 0) {
                var index;
                for (index in result.info) {
                    if (0 == index % 4) {
                        _ += '<div class="row">';
                    }
                    _ += '<div class="col-md-3"><div class="thumbnail">';
                    _ += '<div class="caption" style="display: none;"><h4>设备名：' + result.info[index].devicename + '</h4>';
                    _ += '<p>设备编号：' + result.info[index].coreid + '</p><p>';
                    _ += '<button id="poweron_' + index + '" type="button" class="btn btn-success btn-block" value="'
                        + result.info[index].coreid + '" onclick="updateDevice(this.value, this.id)"';
                    if(true == result.info[index].value) {
                        _ += ' disabled';
                    }
                    _ += '>打开电源</button>';
                    _ += '<button id="poweroff_' + index + '" type="button" class="btn btn-info btn-block" value="'
                        + result.info[index].coreid + '" onclick="updateDevice(this.value, this.id)"';
                    if(0 == result.info[index].value) {
                        _ += ' disabled';
                    }
                    _ += '>关闭电源</button>';
                    _ += '<button id="delete_' + index + '" type="button" class="btn btn-danger btn-block" value="'
                        + result.info[index].coreid + '" onclick="updateDevice(this.value, this.id)" disabled>删除设备</button>';
                    _ += '</p></div>'
                    _ += '<div class="caption-btm text-center" style="display: block;">设备名：' + result.info[index].devicename + '</div>';
                    _ += '<img id="deviceimg_' + index + '"';
                    if(1 == result.info[index].value) {
                        _ += ' src="/images/device_button.png"';
                    } else {
                        _ += ' src="/images/device_button_disable.png"';
                    }
                    _ += '/></div></div>';
                    if (3 == index % 4) {
                        _ += '</div>';
                    }
                }
                if(3 != index % 4) {
                    _ += '</div>';
                }
            } else {
                _ = '<div class="bs-callout bs-callout-info"><h4>无设备，请通过Paratu手机客户端添加设备。</h4></div>';
            }
            res.render('application/devices_management', {title: "Display electrical usage", layout: "layout/dashboard_layout", deviceshtml: _});
        });
    } else {
        res.redirect("/signin");
    }
}