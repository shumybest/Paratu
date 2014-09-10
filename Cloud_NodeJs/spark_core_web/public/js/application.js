//helper functions
var recipeInfoByEdit = {owner:"", action:"create", triggerEvent: {}, responseEvent: {}, recipeRec:{}};
var recipeInfoByLoad = {iftttId: "", active: "", triggerEvent:{}, responseEvent:{}};
var countOfRecipeInfo = 0;
function now() {
    var t = new Date();
    var mon = t.getMonth() + 1;
    var day = t.getDate();
    if(mon < 10) {
        mon = "0" + mon;
    }
    if (day< 10) {
        day = "0" + day;
    }

    return (t.getUTCFullYear() + "-" + mon + "-" + day);
    //return ((t.getUTCFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate()).toString() );
    //return (t.getUTCFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes().toString());
}

function compareDateInString (s, e){ //yyyy-mm-dd
    var start = s.split('-'), end = e.split('-');
    var result = 365*( parseInt(end[0]) - parseInt(start[0])) + 30* (parseInt(end[1]) - parseInt(start[1])) + (parseInt(end[2]) - parseInt(start[2]));
    if(result > 0){
        return false;
    } else {
        return true;
    }
}

function showInfo(e, m) {
    removeHints(e);

    var d = $("#" + e + "hints");
    d.addClass("bs-callout bs-callout-info");
    d.html("<h4>" + m + "</h4>");
}

function showSuccess(e, m) {
    removeHints(e);

    var d = $("#" + e + "hints");
    d.addClass("bs-callout bs-callout-success");
    d.html("<h4>" + m + "</h4>");
}

function showWarning(e, m) {
    removeHints(e);

    var d = $("#" + e + "hints");
    d.addClass("bs-callout bs-callout-warning");
    d.html("<h4>" + m + "</h4>");
}

function showError(e, m) {
    removeHints(e);

    var d = $("#" + e + "hints");
    d.addClass("bs-callout bs-callout-danger");
    d.html("<h4>" + m + "</h4>");
}

function removeHints(e) {
    var d = $("#" + e + "hints");
    d.removeClass("bs-callout bs-callout-danger bs-callout-info bs-callout-success");
    d.html("");
}

function markInputError(e) {
    var d = $("#" + e);
    d.removeClass("has-error has-success has-feedback");
    d.addClass("has-error has-feedback");
}

function markInputOK(e) {
    var d = $("#" + e);
    d.removeClass("has-error has-success has-feedback");
    d.addClass("has-success has-feedback");
}

function charMode(f) {
    var e = f.charCodeAt(0);
    if (e >= 48 && e <= 57) {
        return 1
    } else {
        if (e >= 65 && e <= 90) {
            return 2
        } else {
            if (e >= 97 && e <= 122) {
                return 4
            } else {
                if (-1 < b.indexOf(f)) {
                    return 8
                }
            }
        }
    }
    return 0
}

function checkPasswordStrength(e) {
    var d = 0, f, c = 0;
    for (i = 0; i < e.length; i++) {
        f = charMode(e.charAt(i));
        if (0 == f) {
            return -1
        }
        if (0 == (d & f)) {
            d |= f;
            ++c
        }
    }
    return c
}

function updateSubmitButton(r, b) {
    var d = $("#" + b);
    for(var v in r) {
        if(r[v] == -1) {
            d.attr("disabled", "true");
            return;
        }
    }
    d.removeAttr("disabled");
}

function disableButton(e) {
    var d = $("#" + e);
    d.attr("disabled", "true");
}

function enableButton(e) {
    var d = $("#" + e);
    d.removeAttr("disabled");
}

function powerOnDevice(index) {
    disableButton("poweron_" + index);
    enableButton("poweroff_" + index);
    $("#deviceimg_" + index).attr("src", "/images/device_button.png");
}

function powerOffDevice(index) {
    disableButton("poweroff_" + index);
    enableButton("poweron_" + index);
    $("#deviceimg_" + index).attr("src", "/images/device_button_disable.png");
}

function updateDevice(v, i) {
    var str = i.split(/_/);
    var action = str[0];
    var index = str[1];
    $.ajax({
        type: "POST",
        url: "/updatedevices",
        timeout: 8000,
        data: {coreid: v, action: action},
        success: function (res) {
            if ("success" == res) {
                if("poweron" == action) {
                    toastr.success("打开电源成功", "更新成功");
                    powerOnDevice(index);
                } else if("poweroff" == action) {
                    toastr.success("关闭电源成功", "更新成功");
                    powerOffDevice(index);
                }
            } else {
            }
        },
        error: function(x, t, m) {
            if(t == "timeout") {
                toastr.error("服务器请求超时", "请求超时");
            }
        }
    });
}

// selective load javascript
$(document).ready(function() {
    $(".thumbnail").hover(
        function () {
            $(this).find(".caption").fadeIn(350);
            $(".caption-btm").fadeOut(250);
        },
        function () {
            $(this).find(".caption").fadeOut(350);
            $(".caption-btm").fadeIn(250);
        });
});

var reg = /reg/;
var chpass = /changePass/;
var fgtpass = /forgetPass/;
var rstpass = /resetPass/;

function new_password_confirmation(result) {

}

if (reg.test(document.URL)) {

    $(document).ready(function () {
        var result = [-1, -1, -1];
        $("#username").blur(function () {
            var val = $("#username").val();
            if (val != "") {
                if(val.length < 5) {
                    markInputError("username_group");
                    showError("reg", "用户名长度必须大于5个字母");
                    result[0] = -1;
                    updateSubmitButton(result, "btn_submit");
                } else {
                    $.ajax({
                        type: "POST",
                        url: "/checkusername",
                        data: {username: val},
                        success: function (res) {
                            if ("success" == res) {
                                markInputError("username_group");
                                showError("reg", "此用户名已被注册");
                                result[0] = -1;
                                updateSubmitButton(result, "btn_submit");
                            } else {
                                markInputOK("username_group");
                                showSuccess("reg", "此用户可以使用");
                                result[0] = 0;
                                updateSubmitButton(result, "btn_submit");
                            }
                        }
                    });
                }
            }
        });

        $("#email").blur(function () {
            var reg = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
            var val = $("#email").val();
            if (val != "") {
                if (!reg.test(val)) {
                    markInputError("email_group");
                    showError("reg", "无效的Email格式");
                    result[1] = -1;
                    updateSubmitButton(result, "btn_submit");
                } else {
                    $.ajax({
                        type: "POST",
                        url: "/checkemail",
                        data: {email: val},
                        success: function (res) {
                            if ("success" == res) {
                                markInputError("email_group");
                                showError("reg", "此邮箱地址已被注册");
                                result[1] = -1;
                                updateSubmitButton(result, "btn_submit");
                            } else {
                                markInputOK("email_group");
                                showSuccess("reg", "此邮箱地址可以使用");
                                result[1] = 0;
                                updateSubmitButton(result, "btn_submit");
                            }
                        }
                    });
                }
            }
        });

        $("#password").keyup(function () {
            var result = checkPasswordStrength($("#password").val());
            switch (result) {
                case 1:
                    showError("reg", "密码强度：弱");
                    break;
                case 2:
                    showWarning("reg", "密码强度：中");
                    markInputOK("pass_group");
                    break;
                case 3:
                case 4:
                    showSuccess("reg", "密码强度：强");
                    markInputOK("pass_group");
                    break;
                default:
                    break
            }
        });

        $("#password_confirmation").keyup(function () {
            var password = $("#password").val();
            var password_confirm = $("#password_confirmation").val();

            if (password != password_confirm) {
                markInputError("pass_group");
                markInputError("pass_group2");
                showError("reg", "输入的密码不一致");
                result[2] = -1;
                updateSubmitButton(result, "btn_submit");
            } else {
                markInputOK("pass_group");
                markInputOK("pass_group2");
                removeHints("reg");
                result[2] = 0;
                updateSubmitButton(result, "btn_submit");
            }
        });
    });

} else if (chpass.test(document.URL)) {

    $(document).ready(function () {
        var result = [-1, -1];
        $("#password").blur(function () {
            var name = $("#username").val();
            var pass = $("#password").val();
            if (name != "" && pass != "") {
                $.ajax({
                    type: "POST",
                    url: "/trylogin",
                    data: {username: name, password: pass},
                    success: function (res) {
                        if ("can login" == res) {
                            markInputOK("password_group");
                            showSuccess("chpass", "密码验证成功");
                            result[0] = 0;
                            updateSubmitButton(result, "btn_submit");
                        } else {
                            markInputError("password_group");
                            showError("chpass", "原始密码错误");
                            result[0] = -1;
                            updateSubmitButton(result, "btn_submit");
                        }
                    }
                });
            }
        });

        $("#new_password").keyup(function () {
            var result = checkPasswordStrength($("#new_password").val());
            switch (result) {
                case 1:
                    showError("chpass", "密码强度：弱");
                    break;
                case 2:
                    showWarning("chpass", "密码强度：中");
                    markInputOK("pass_group");
                    break;
                case 3:
                case 4:
                    showSuccess("chpass", "密码强度：强");
                    markInputOK("pass_group");
                    break;
                default:
                    break
            }
        });

        $("#password_confirmation").keyup(function () {
            var password = $("#new_password").val();
            var password_confirm = $("#password_confirmation").val();

            if (password != password_confirm) {
                markInputError("pass_group");
                markInputError("pass_group2");
                showError("chpass", "输入的密码不一致");
                result[1] = -1;
                updateSubmitButton(result, "btn_submit");
            } else {
                markInputOK("pass_group");
                markInputOK("pass_group2");
                removeHints("chpass");
                result[1] = 0;
                updateSubmitButton(result, "btn_submit");
            }
        });
    });
}
else if (fgtpass.test(document.URL)) {

    $(document).ready(function () {

        var result = [-1, -1];

        $('#username').blur(function () {
            var name = $("#username").val();
            var email = $('#email').val();
            var reqData = (email == "") ? {name: name} : {name: name, email: email};
            if(name != ""){
                $.ajax({
                    type: "POST",
                    url: "/fgtPass",
                    data : reqData,
                    success: function(res){
                        if("existed" == res){
                            markInputOK("username");
                            if(email == "") {
                                showSuccess("fgtpass", "用户名存在" );
                            } else{
                                removeHints("fgtpass");
                            }
                            result[0] = 0;
                            updateSubmitButton(result, "btn_submit");
                        } else{
                            markInputError("username");
                            showError("fgtpass", (email == "") ? "用户名不存在" : "用户名与邮箱不匹配，请核实");
                            result[0] = -1;
                            updateSubmitButton(result, "btn_submit");
                        }
                    }
                });
            }
        });

        $("#email").keyup(function () {
            var name = $('#username').val();
            var email = $("#email").val();
            var reqData = (name == "") ? {email: email} : {name: name, email: email};
            if(email != ""){
                $.ajax({
                    type: "POST",
                    url:"/fgtPass",
                    data: reqData,
                    success: function(res){
                        if("existed" == res)
                        {
                            markInputOK("email");
                            if(name == "") {
                                showSuccess("fgtpass", "邮箱地址存在");
                            } else {
                                removeHints("fgtpass");
                            }
                            result[1] = 0;
                            updateSubmitButton(result, "btn_submit");
                        } else {
                            markInputError("email");
                            showError("fgtpass", (name == "")? "邮箱地址不存在": "用户名与邮箱不匹配");
                            result[1] = -1;
                            updateSubmitButton(result, "btn_submit");
                        }
                    }
                });
            }
        });

    });
}
else if (rstpass.test(document.URL)) {

    $(document).ready(function() {

        var result = [0, -1];
        $('#new_password').keyup(function() {
            var result = checkPasswordStrength($("#new_password").val());
            switch (result) {
                case 1:
                    showError("rstpass", "密码强度：弱");
                    break;
                case 2:
                    showWarning("rstpass", "密码强度：中");
                    markInputOK("pass_group");
                    break;
                case 3:
                case 4:
                    showSuccess("rstpass", "密码强度：强");
                    markInputOK("pass_group");
                    break;
                default:
                    break;
            }
        });

        $('#password_confirmation').keyup(function() {
            var password = $("#new_password").val();
            var password_confirm = $("#password_confirmation").val();

            if (password != password_confirm) {
                markInputError("pass_group");
                markInputError("pass_group2");
                showError("rstpass", "输入的密码不一致");
                result[1] = -1;
                updateSubmitButton(result, "btn_submit");
            } else {
                markInputOK("pass_group");
                markInputOK("pass_group2");
                removeHints("rstpass");
                result[1] = 0;
                updateSubmitButton(result, "btn_submit");
            }
        });
    });

}
