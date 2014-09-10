function NamespacesPrototype() {
    function b(c, d, e) {
        c[d] = e;
        e._path = c._path ? (c._path + "." + d) : d;
        e._parent = c
    }

    function a(d, f, c) {
        var e = f.shift();
        if (0 == f.length) {
            b(d, e, c())
        } else {
            if (!d[e]) {
                b(d, e, {})
            }
            a(d[e], f, c)
        }
    }

    this.create = function (d, c) {
        a(window, d.split("."), function () {
            return new c()
        })
    };
    this.register = function (d, c) {
        a(window, d.split("."), function () {
            return c
        })
    }
}
var Namespaces;
if (!Namespaces) {
    Namespaces = new NamespacesPrototype()
}
;
Namespaces.create("com.netease.mail.common.JSLoader", function () {
    var f = {};
    var b = {};
    var e = {};
    var h = this;

    function a(n) {
        var o = b[n];
        if (o) {
            var m = [];
            for (var k = 0; k < o.length; k++) {
                var j = o[k];
                if (!j.flag) {
                    j.flag = 1;
                    for (var l in j.srcs) {
                        if (3 != f[l]) {
                            j.flag = 0;
                            m.push(j);
                            break
                        }
                    }
                    if (j.flag) {
                        j.callback()
                    }
                }
            }
            b[n] = m
        }
    }

    function c(k) {
        var j = document.getElementsByTagName("HEAD").item(0);
        var i = document.createElement("script");
        i.language = "javascript";
        i.type = "text/javascript";
        i.text = k;
        j.appendChild(i)
    }

    function g(i) {
        if (1 != f[i]) {
            return
        }
        f[i] = 2;
        $.ajax({url: i, type: "GET", dataType: "text", success: function (k, j, l) {
            c(k);
            f[i] = 3;
            a(i)
        }})
    }

    function d(j, i) {
        if (!b[j]) {
            b[j] = []
        }
        var k = b[j];
        k.push(i)
    }

    this.mark = function (j) {
        for (var k = 0; k < j.length; k++) {
            var l = j[k];
            f[l] = 3
        }
    };
    this.include = function (k, p, o) {
        if (o) {
            if (e[o]) {
                return
            }
            e[o] = 1
        }
        var j = {flag: 0, srcs: {}, callback: p};
        var m = typeof p == "function";
        for (var l = 0; l < k.length; l++) {
            var n = k[l];
            if (3 != f[n]) {
                if (m) {
                    m = false;
                    j.srcs[n] = 1;
                    d(n, j)
                }
                if (!f[n]) {
                    f[n] = 1;
                    g(n)
                }
            }
        }
        if (m) {
            p()
        }
    }
});
Namespaces.create("com.netease.mail.common.PopFuncs", function () {
    this.agt = navigator.userAgent.toLowerCase();
    this.ie = ((this.agt.indexOf("msie") != -1) && (this.agt.indexOf("opera") == -1) && (this.agt.indexOf("omniweb") == -1));
    this.isValid = function (a) {
        return null != a && typeof a != undefined
    };
    this.judgeVal = function (a, b) {
        return this.isValid(a) ? a : b
    };
    this.getTrueBody = function (b) {
        var a = b || window;
        var c = a.document;
        return(c.compatMode && c.compatMode != "BackCompat") ? c.documentElement : c.body
    };
    this.getScrollTop = function (b) {
        var a = b || window;
        return this.ie ? this.getTrueBody(a).scrollTop : a.pageYOffset
    };
    this.getScrollLeft = function (b) {
        var a = b || window;
        return this.ie ? this.getTrueBody(a).scrollLeft : a.pageXOffset
    };
    this.getMezzoTop = function (d, a, c, b) {
        return(this.judgeVal(c, this.getScrollTop(b)) + (((a || this.getTrueBody(b).clientHeight) - d) >> 1))
    };
    this.getMezzoLeft = function (a, d, c, b) {
        return(this.judgeVal(c, this.getScrollLeft(b)) + (((d || this.getTrueBody(b).clientWidth) - a) >> 1))
    };
    this.getPageSize = function () {
        var a = this.getTrueBody(window);
        var d = 0;
        var b = 0;
        var c = 0;
        var f = 0;
        var e = [0, 0];
        e[0] = a.clientHeight;
        e[1] = a.clientWidth;
        d = a.offsetWidth;
        b = a.offsetHeight;
        c = a.scrollWidth;
        f = a.scrollHeight;
        if (b > e[0]) {
            e[0] = b
        }
        if (d > e[1]) {
            e[1] = d
        }
        if (f > e[0]) {
            e[0] = f
        }
        if (c > e[1]) {
            e[1] = c
        }
        return e
    };
    this.getMaxClientWidth = function () {
        var a = this.getTrueBody(window);
        return Math.max(a.clientWidth, a.scrollWidth)
    }
});
Namespaces.register("com.netease.mail.common.Popup", function Popup(b, e, i, d, c) {
    this.divPopup = b;
    this.divMask = e;
    this.deltaX = d || 0;
    this.deltaY = c || 0;
    this.currX = 0;
    this.currY = 0;
    var f = this;
    var a = com.netease.mail.common.PopFuncs;
    var h = function (j) {
        return document.getElementById(j)
    };
    this.reposition = function (p, n, o, k) {
        var m = h(this.divPopup);
        if (!m || "none" == m.style.display) {
            return
        }
        m.style.top = (this.currY || (this.deltaY + a.getMezzoTop(m.offsetHeight, k, n, window))) + "px";
        m.style.left = (this.currX || (this.deltaX + a.getMezzoLeft(m.offsetWidth, o, p, window))) + "px";
        var j = a.getPageSize();
        var l = h(this.divMask);
        l.style.height = j[0] + "px";
        l.style.width = j[1] + "px"
    };
    this.show = function (j, o, n, l, m, k) {
        h(this.divMask).style.display = "";
        h(this.divPopup).style.display = "";
        this.currX = j;
        this.currY = o;
        this.reposition(n, l, m, k)
    };
    this.hide = function () {
        h(this.divPopup).style.display = "none";
        h(this.divMask).style.display = "none"
    };
    $(window).resize(function () {
        f.reposition()
    });
    var g = i || window;
    $(g).scroll(function () {
        f.reposition()
    })
});
Namespaces.create("com.netease.mail.common.RequestUtils", function () {
    var a = false;
    if (typeof XMLHttpRequest != "undefined") {
        var b = new XMLHttpRequest();
        if ("withCredentials" in b) {
            a = true
        }
    }
    this.fUrlP = function (d, e, c) {
        if (c) {
            return d + "=" + e
        } else {
            return"&" + d + "=" + e
        }
    };
    this.formSubmit = function (e, f, i, g, d) {
        var h = $("#" + e);
        h.attr("action", f);
        h.attr("method", i);
        h.children("input").remove();
        for (var c in g) {
            h.append('<input type="hidden" name="' + c + '" value="' + g[c] + '" />')
        }
        for (var c in d) {
            h.attr(c, d[c])
        }
        h.submit();
        for (var c in d) {
            h.removeAttr(c)
        }
    };
    this.getCookie = function (d) {
        if (0 < document.cookie.length) {
            var c = d + "=";
            start = document.cookie.indexOf(c);
            if (-1 < start) {
                start += c.length;
                end = document.cookie.indexOf(";", start);
                if (0 > end) {
                    end = document.cookie.length
                }
                return unescape(document.cookie.substring(start, end))
            }
        }
        return null
    };
    this.supportCORS = function () {
        return a
    }
});
Namespaces.create("com.netease.mail.common.StringUtils", function () {
    this.paramReg = new RegExp("\\$(.{1,20}?)\\$", "gm");
    this.merge = function (e, f, d) {
        return e.replace(this.paramReg, function (g) {
            var h = f[g.substring(1, g.length - 1)];
            if (null != h) {
                return h
            } else {
                if (typeof h == "undefined") {
                    return g
                } else {
                    return d || "空"
                }
            }
        })
    };
    this.filterMap = {"\n": "<br/>", "<": "&lt;", ">": "&gt;"};
    var c = "";
    for (var a in this.filterMap) {
        if (0 < c.length) {
            c += "|"
        }
        c += a
    }
    this.filterExp = new RegExp(c, "gm");
    this.doFilter = function (e, d) {
        if (!e) {
            return e
        }
        var f = d || this.filterMap;
        return e.replace(this.filterExp, function (g) {
            return f[g]
        })
    };
    this.blankStr = new RegExp("^\\s*$");
    this.isEmpty = function (d) {
        return null == d || typeof d == "undefined" || this.blankStr.test(d)
    };
    this.isBlank = function (d) {
        return null == d || this.blankStr.test(d)
    };
    this.fLen = function (g) {
        var d = 0;
        var f = g.length;
        for (var e = 0; e < f; e++) {
            if (g.charCodeAt(e) > 255) {
                d += 2
            } else {
                d++
            }
        }
        return d
    };
    this.join = function (i, d, f) {
        var j = d || "=";
        var g = f || ",";
        var h = "";
        for (var e in i) {
            if (0 < h.length) {
                h += g
            }
            h += (e + j + encodeURIComponent(i[e] || ""))
        }
        return h
    };
    var b = " 　`｀~～!！@·#＃$￥%％^…&＆()（）-－_—=＝+＋[]［］|·:：;；\"“\\、'‘,，<>〈〉?？/／*＊.。{}｛｝";
    this.charMode = function (f) {
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
    };
    this.toSBC = function (f) {
        var e = "";
        for (var g = 0; g < f.length; g++) {
            var h = f.charCodeAt(g);
            if (h == 32) {
                e += String.fromCharCode(12288)
            } else {
                if (h < 127) {
                    e = String.fromCharCode(h + 65248)
                } else {
                    e += String.fromCharCode(h)
                }
            }
        }
        return e
    };
    this.toDBC = function (f) {
        var e = "";
        for (var g = 0; g < f.length; g++) {
            var h = f.charCodeAt(g);
            if (h == 12288) {
                e += String.fromCharCode(32)
            } else {
                if (h > 65280 && h < 65375) {
                    e += String.fromCharCode(h - 65248)
                } else {
                    e += String.fromCharCode(h)
                }
            }
        }
        return e
    }
});
Namespaces.create("com.netease.mail.unireg.register.common.CheckUtils", function () {
    var b = com.netease.mail.common.StringUtils;
    var a = {repeat: function (c) {
        return/^(.)\1+$/.test(c)
    }, list: (function () {
        var c = ["123456", "123456789", "12345678", "123123", "5201314", "1234567", "7758521", "654321", "1314520", "123321", "1234567890", "147258369", "123654", "5211314", "woaini", "1230123", "987654321", "147258", "123123123", "7758258", "520520", "789456", "456789", "159357", "112233", "1314521", "456123", "110110", "521521", "zxcvbnm", "789456123", "0123456789", "0123456", "123465", "159753", "qwertyuiop", "987654", "115415", "1234560", "123000", "123789", "100200", "963852741", "121212", "111222", "123654789", "12301230", "456456", "741852963", "asdasd", "asdfghjkl", "369258", "863786", "258369", "8718693", "666888", "5845201314", "741852", "168168", "iloveyou", "852963", "4655321", "102030", "147852369", "321321"];
        return function (e) {
            for (var d = 0; d < c.length; d++) {
                if (e == c[d]) {
                    return true
                }
            }
            return false
        }
    })()};
    this.checkName = function (c) {
        var d = b.fLen(c);
        var e = /^[\w]+$/.test(c);
        if (d == 0) {
            return 0
        } else {
            if (!e) {
                return -3
            } else {
                if (d > 18) {
                    if (d < 21) {
                        return -9
                    }
                    return -6
                } else {
                    if (d < 6) {
                        if (d > 2) {
                            return -10
                        }
                        return -2
                    } else {
                        if (/^[0-9]+$/.test(c)) {
                            if (/^1[3458]\d{9}$/.test(c)) {
                                return -8
                            }
                            return -7
                        } else {
                            if (/^\d.*$/.test(c)) {
                                return -1
                            } else {
                                if (!/^([a-z]|[A-Z])/.test(c)) {
                                    return -4
                                } else {
                                    if (!(/[0-9a-zA-Z]+$/.test(c))) {
                                        return -5
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return 1
    };
    this.checkPasswordStrength = function (e) {
        var d = 0, f, c = 0;
        for (i = 0; i < e.length; i++) {
            f = b.charMode(e.charAt(i));
            if (0 == f) {
                return -1
            }
            if (0 == (d & f)) {
                d |= f;
                ++c
            }
        }
        return c
    };
    this.checkPassword = function (e) {
        var c = e.length;
        for (i = 0; i < c; i++) {
            if (0 == b.charMode(e.charAt(i))) {
                return -3
            }
        }
        if (c < 6) {
            return -1
        } else {
            if (c > 16) {
                return -2
            } else {
                for (var d in a) {
                    if (a[d](e)) {
                        return -4
                    }
                }
            }
        }
        return 1
    };
    this.backendCheckName = function (c, d) {
        $.post("/unireg/call.do?cmd=urs.checkName", {name: c}, d)
    };
    this.isMobile = function (c) {
        return/^1[3458]\d{9}$/.test(c)
    };
    this.checkMobile = function (c) {
        return c == "" ? 0 : this.isMobile(c) ? 1 : -1
    };
    this.checkVcode = function (c) {
        return(c == "") ? 0 : 1
    }
});
Namespaces.create("com.netease.mail.unireg.register.common.FormLogger", function () {
    function a(c, b) {
        b.level = c;
        $.post("/unireg/call.do?cmd=register.formLog", b)
    }

    this.info = function (b) {
        a("info", b)
    };
    this.warn = function (b) {
        a("warn", b)
    };
    this.error = function (b) {
        a("error", b)
    };
    this.fatal = function (b) {
        a("fatal", b)
    }
});
Namespaces.create("com.netease.mail.unireg.register.common.LoginUtils", function () {
    var c = com.netease.mail.common.RequestUtils;
    var d = com.netease.mail.common.StringUtils;
    var a = {"163.com": "http://entry.mail.163.com/coremail/fcg/ntesdoor2?lightweight=1&verifycookie=1&language=-1&style=-1&from=unireg&df=unireg&username=", "126.com": "http://entry.mail.126.com/cgi/ntesdoor?lightweight=1&verifycookie=1&language=-1&style=-1&from=unireg&df=unireg&username=", "yeah.net": "http://entry.mail.yeah.net/cgi/ntesdoor?lightweight=1&verifycookie=1&language=-1&style=-1&from=unireg&df=unireg&username="};
    var b = {"163.com": "mail163", "126.com": "mail126", "yeah.net": "mailyeah"};
    this.login = function (m, j, g, k, h, l) {
        var i = j + "@" + g;
        var e = {username: i, domain: g, password: k, language: "-1", passtype: (typeof h == "undefined" ? "1" : h), savelogin: "0"};
        var f = "https://reg.163.com/logins.jsp?type=1";
        if (d.isEmpty(l)) {
            f += c.fUrlP("url", encodeURIComponent(a[g] + i))
        } else {
            f += c.fUrlP("url", l)
        }
        c.formSubmit(m, f, "POST", e)
    }
});
Namespaces.create("com.netease.mail.unireg.register.common.VerifyUtils", function () {
    this.__$0 = function (a) {
        var q = 10, w = a, n, m = w.length, f = new Date(), b = f.getTime(), c = b % q, h = (b - c) / q;
        if (c < 1) {
            c = 1
        }
        c = b % q;
        var d = b % (q * q);
        h = (b - d) / q;
        h = h / q;
        d = (d - c) / q;
        var z = b + "", p = z.charAt(q), g = c + "" + d + "" + p, l = Number(g), e = l * Number(w), x = e + "", k = "";
        for (n = (e + "").length - 1; n >= 0; n--) {
            var o = x.charAt(n);
            k = k + o
        }
        var i = p + k + d + c, y = i.length, j = 0, r = "", v = "";
        for (j = 0; j < y; q++) {
            r = r + i.charAt(j);
            j = j + 2
        }
        for (j = 1; j < y; j = j + 2) {
            v = v + i.charAt(j)
        }
        var u = r + v;
        u = i;
        var t = 0, s = "";
        for (t = 0; t < u.length; t++) {
            s = s + u.charAt(t)
        }
        return u
    }
});
Namespaces.create("com.netease.mail.unireg.register.main.RemindUtils", function () {
    var b = com.netease.mail.common.StringUtils;
    var c = {success: '<div id="m_$fieldId$" class="tips"><span class="txt-succ"><b class="ico ico-suc-sml"></b>&nbsp;&nbsp;$msg$</span></div>', error: '<div id="m_$fieldId$" class="tips"><span class="txt-err"><b class="ico ico-warn-sml"></b>&nbsp;&nbsp;$msg$</a></span></div>'};
    var a = {error: function (d) {
        $("#" + d + "Ipt").addClass("ipt-err")
    }};
    this.showRemind = function (f, e, g) {
        var d = $("#" + e + "Tips");
        this.hideRemind(e);
        d.after(b.merge(c[f], {fieldId: e, msg: g}));
        var h = a[f];
        if (h) {
            h(e)
        }
        d.hide()
    };
    this.hideRemind = function (d) {
        $("#m_" + d).remove();
        $("#" + d + "Tips").show();
        $("#" + d + "Ipt").removeClass("ipt-err")
    }
});
Namespaces.create("com.netease.mail.unireg.register.main.Start", function () {
    var O = "main";
    var f = this;
    var n = com.netease.mail.common.StringUtils;
    var v = com.netease.mail.common.RequestUtils;
    var q = com.netease.mail.unireg.register.common.CheckUtils;
    var K = com.netease.mail.unireg.register.common.VerifyUtils;
    var b = com.netease.mail.unireg.register.common.FormLogger;
    var d = com.netease.mail.unireg.register.main.RemindUtils;
    var m;
    var i;
    var k = {};
    var x = null;
    var H = null;
    var P = {};
    var j = {name: false, pwd: false, cfmPwd: false, mobile: true, vcode: false, accept: true};
    var D;
    var J;
    var y;
    var a;
    var t;
    var h;
    var c = {disable: '<li class="disable"><label><input name="candName" type="radio"/>$name$@$domain$</label><span class="extInfo">(已被注册)</span></li>', vip163: '<li><label><input type="radio" style="visibility:hidden"/><b class="ico-vip"></b><a onclick="_Global.main.turnToVip(\'$name$\',\'$domain$\',\'vip163\');">$name$@$domain$</a></label><span class="extInfo">(特权邮箱，付费)</span></li>', vip126: '<li><label><input type="radio" style="visibility:hidden"/><b class="ico-vip"></b><a onclick="_Global.main.turnToVip(\'$name$\',\'$domain$\',\'vip126\');">$name$@$domain$</a></label><span class="extInfo">(特权邮箱，付费)</span></li>', vip188: '<li><label><input type="radio" style="visibility:hidden"/><b class="ico-vip"></b><a onclick="_Global.main.turnToVip(\'$name$\',\'$domain$\',\'vip126\');">$name$@$domain$</a></label><span class="extInfo">(特权邮箱，付费)</span></li>', free: '<li><label onclick="_Global.main.selectCandidate(\'$name$\',\'$domain$\');"><input name="candName" type="radio"/>$name$<span class="txt-succ">@$domain$</span></label><span class="extInfo">(可以注册)</span></li>'};
    var g;

    function E() {
        for (var T in j) {
            if (!j[T]) {
                return false
            }
        }
        return true
    }

    function p(T) {
        x = T;
        H = T;
        P[T] = new Date().getTime();
        k[T] = false;
        j[T] = false
    }

    function I(U, T) {
        x = null;
        if (k[U] && P[U]) {
            var V = $.extend({opt: "write_field", flow: O, field: U}, T);
            V.timecost = new Date().getTime() - P[U];
            b.info(V)
        }
        P[U] = false
    }

    this.selectCandidate = function (T, U) {
        j.name = true;
        G();
        N(U)
    };
    this.turnToVip = function (T, V, U) {
        b.info({opt: "trun_to_vip", name: T, domain: V, vipDomain: U});
        switch (U) {
            case"vip163":
                window.location.href = "http://reg.vip.163.com/register.m?b09bqa1&from=fmail_reg&pageReg=1&username=" + T;
                break;
            case"vip126":
                window.location.href = "http://reg.vip.126.com/register.m?b09bqa1&from=fmail_reg&pageReg=1&username=" + T;
                break;
            case"vip188":
                window.location.href = "http://reg.mail.188.com/servlet/regist?b12bqa1&from=fmail_reg&pageReg=1&username=" + T;
                break;
            default:
                window.location.href = "http://reg.vip.163.com/register.m?b09bqa1&from=fmail_reg&pageReg=1&username=" + T;
                break
        }
    };
    function Q(T, U) {
        $("#conflictOthersDiv").show();
        $("#conflictOthers").append(n.merge(c[T], U))
    }

    function R(W, V) {
        var U = V["163.com"];
        var T = V["126.com"];
        var X = V["yeah.net"];
        if (U) {
            Q("free", {name: W, domain: "163.com"})
        }
        if (T) {
            Q("free", {name: W, domain: "126.com"})
        }
        if (X) {
            Q("free", {name: W, domain: "yeah.net"})
        }
        if (!U) {
            Q("disable", {name: W, domain: "163.com"})
        }
        if (!T) {
            Q("disable", {name: W, domain: "126.com"})
        }
        if (!X) {
            Q("disable", {name: W, domain: "yeah.net"})
        }
        switch (y) {
            case"163.com":
            case"yeah.net":
                if (V.vip163) {
                    Q("vip163", {name: W, domain: "vip.163.com"})
                } else {
                    if (V.vip126) {
                        Q("vip126", {name: W, domain: "vip.126.com"})
                    } else {
                        if (V.vip188) {
                            Q("vip188", {name: W, domain: "188.com"})
                        }
                    }
                }
                break;
            case"126.com":
                if (V.vip126) {
                    Q("vip126", {name: W, domain: "vip.126.com"})
                } else {
                    if (V.vip163) {
                        Q("vip163", {name: W, domain: "vip.163.com"})
                    } else {
                        if (V.vip188) {
                            Q("vip188", {name: W, domain: "188.com"})
                        }
                    }
                }
        }
    }

    function C() {
        if (!g) {
            alert("setTime:" + operTime);
            g = operTime
        }
    }

    function G() {
        $("#conflictDiv").hide();
        $("#nameTips").show()
    }

    function S(V, T, U) {
        d.hideRemind("nameTips");
        $("#nameTips").hide();
        $("#conflictOthersDiv").hide();
        $("#conflictOthers > li").remove();
        if (T) {
            $("#conflictTitle").attr("class", "txt-succ txt-14")
        } else {
            $("#conflictTitle").attr("class", "txt-impt txt-14")
        }
        if (U) {
            $("#conflictMobile").hide()
        } else {
            $("#conflictMobile").show()
        }
        $("#conflictTitle").html(V);
        $("#conflictDiv").show()
    }

    function F(W, V, T) {
        var U = T || {};
        switch (W) {
            case"numberstart":
                S("邮件地址必需以英文字母开头");
                switch (y) {
                    case"163.com":
                    case"yeah.net":
                        if (U.vip163) {
                            Q("vip163", {name: V, domain: "vip.163.com"})
                        } else {
                            if (U.vip126) {
                                Q("vip126", {name: V, domain: "vip.126.com"})
                            }
                        }
                        break;
                    case"126.com":
                        if (U.vip126) {
                            Q("vip163", {name: V, domain: "vip.126.com"})
                        } else {
                            if (U.vip163) {
                                Q("vip126", {name: V, domain: "vip.163.com"})
                            }
                        }
                }
                break;
            case"allnumber":
                S("邮件地址必需以英文字母开头");
                if (U.vip163) {
                    Q("vip163", {name: V, domain: "vip.163.com"})
                }
                break;
            case"wrongchar":
                S("邮件地址需由字母、数字或下划线组成");
                switch (y) {
                    case"163.com":
                    case"yeah.net":
                        if (U.vip163) {
                            Q("vip163", {name: V, domain: "vip.163.com"})
                        } else {
                            if (U.vip126) {
                                Q("vip126", {name: V, domain: "vip.126.com"})
                            } else {
                                if (U.vip188) {
                                    Q("vip188", {name: V, domain: "188.com"})
                                }
                            }
                        }
                        break;
                    case"126.com":
                        if (U.vip126) {
                            Q("vip126", {name: V, domain: "vip.126.com"})
                        } else {
                            if (U.vip163) {
                                Q("vip163", {name: V, domain: "vip.163.com"})
                            } else {
                                if (U.vip188) {
                                    Q("vip188", {name: V, domain: "188.com"})
                                }
                            }
                        }
                        break
                }
                break;
            case"longname":
                S("长度应为6~18个字符");
                if (V.length <= 20) {
                    switch (y) {
                        case"163.com":
                        case"yeah.net":
                            if (U.vip163) {
                                Q("vip163", {name: V, domain: "vip.163.com"})
                            } else {
                                if (U.vip126) {
                                    Q("vip126", {name: V, domain: "vip.126.com"})
                                } else {
                                    if (U.vip188) {
                                        Q("vip188", {name: V, domain: "188.com"})
                                    }
                                }
                            }
                            break;
                        case"126.com":
                            if (U.vip126) {
                                Q("vip126", {name: V, domain: "vip.126.com"})
                            } else {
                                if (U.vip163) {
                                    Q("vip163", {name: V, domain: "vip.163.com"})
                                } else {
                                    if (U.vip188) {
                                        Q("vip188", {name: V, domain: "188.com"})
                                    }
                                }
                            }
                            break
                    }
                    break
                }
            case"shortname":
                S("长度应为6~18个字符");
                switch (y) {
                    case"163.com":
                    case"yeah.net":
                        if (U.vip163) {
                            Q("vip163", {name: V, domain: "vip.163.com"})
                        } else {
                            if (U.vip126) {
                                Q("vip126", {name: V, domain: "vip.126.com"})
                            } else {
                                if (U.vip188) {
                                    Q("vip188", {name: V, domain: "188.com"})
                                }
                            }
                        }
                        break;
                    case"126.com":
                        if (U.vip126) {
                            Q("vip126", {name: V, domain: "vip.126.com"})
                        } else {
                            if (U.vip163) {
                                Q("vip163", {name: V, domain: "vip.163.com"})
                            } else {
                                if (U.vip188) {
                                    Q("vip188", {name: V, domain: "188.com"})
                                }
                            }
                        }
                        break
                }
                break;
            case"alloccupy":
                S("该邮件地址已被注册");
                R(V, U);
                break;
            case"freealloccupy":
                S("该邮件地址已被注册");
                switch (y) {
                    case"163.com":
                    case"yeah.net":
                        if (U.vip163) {
                            Q("vip163", {name: V, domain: "vip.163.com"})
                        } else {
                            if (U.vip126) {
                                Q("vip126", {name: V, domain: "vip.126.com"})
                            } else {
                                if (U.vip188) {
                                    Q("vip188", {name: V, domain: "188.com"})
                                }
                            }
                        }
                        break;
                    case"126.com":
                        if (U.vip126) {
                            Q("vip126", {name: V, domain: "vip.126.com"})
                        } else {
                            if (U.vip163) {
                                Q("vip163", {name: V, domain: "vip.163.com"})
                            } else {
                                if (U.vip188) {
                                    Q("vip188", {name: V, domain: "188.com"})
                                }
                            }
                        }
                        break
                }
                R(V, U);
                break;
            case"freesomeoccupy":
                S("该邮件地址已被注册");
                R(V, U);
                break
        }
    }

    function o(U, T) {
        q.backendCheckName(T, function (V) {
            switch (V.code) {
                case 200:
                    F(U, T, V.result);
                    break;
                default:
                    d.showRemind("error", "name", "系统忙");
                    break
            }
        })
    }

    function N(U) {
        y = U;
        var T = D[y];
        $("#vcodeImg").attr("src", T.src + J + new Date().getTime());
        $("#vcodeIpt").css("width", T.iptwidth + "px");
        $("#vcodeImg").attr("width", T.imgwidth);
        $("#vcodeImg").attr("height", T.imgheight);
        $("#vRemind").html(T.tips);
        T.callback();
        s(U)
    }

    function s(T) {
        switch (T) {
            case"163.com":
                $("#mainDomainSelect option:nth-child(1)").attr("selected", "selected");
                break;
            case"126.com":
                $("#mainDomainSelect option:nth-child(2)").attr("selected", "selected");
                break;
            default:
                $("#mainDomainSelect option:nth-child(3)").attr("selected", "selected");
                break
        }
    }

    function B(W, U) {
        var T = n.fLen(W);
        var V = q.checkPasswordStrength(W);
        if (-1 == V) {
            $("#mainPwdStatus").hide();
            if (!U) {
                d.showRemind("error", "mainPwd", "密码必需由英文字母、数字或特殊符号组成")
            }
            return
        }
        if (T < 6) {
            if (T == 0) {
                d.hideRemind("mainPwd");
                d.hideRemind("mainCfmPwd")
            }
            $("#mainPwdStatus").hide();
            return
        }
        if (T > 16) {
            $("#mainPwdStatus").hide();
            if (!U) {
                d.showRemind("error", "mainPwd", "密码长度应为6~16个字符")
            }
            return
        }
        $("#mainPwdStatus ").show();
        d.hideRemind("mainPwd");
        switch (V) {
            case 2:
                $("#mainPwdStatus").attr("class", "pswState pswState-normal");
                break;
            case 3:
            case 4:
                $("#mainPwdStatus").attr("class", "pswState pswState-strong");
                break;
            default:
                $("#mainPwdStatus").attr("class", "pswState pswState-poor");
                break
        }
    }

    function l() {
        $("#vcodeImg").attr("src", D[y].src + J + new Date().getTime());
        $("#vcodeIpt").val("");
        j.vcode = false
    }

    this.initEnv = function (T) {
        J = "&env=" + K.__$0(T) + "&t="
    };
    this.recover = function () {
        l();
        z();
        $("#nameIpt").blur()
    };
    function M(T) {
        return"" == T || h == T
    }

    function L(T) {
        q.backendCheckName(T, function (V) {
            switch (V.code) {
                case 200:
                    var U = V.result;
                    if (!U) {
                        F("alloccupy", T, U)
                    } else {
                        if (U[y]) {
                            G();
                            d.showRemind("success", "name", "恭喜，该邮件地址可注册");
                            j.name = true
                        } else {
                            if (U["163.com"] || U["126.com"] || U["yeah.net"] || U.vip163 || U.vip126 || U.vip188) {
                                F("freesomeoccupy", T, U)
                            }
                        }
                    }
                    break;
                default:
                    d.showRemind("error", "name", "系统忙");
                    break
            }
        })
    }

    var e = {name: function (T) {
        var V = "regForm-item mainBody-hasFocus-focusArea";
        var U = V + " regForm-item-focus";
        $("#nameIpt").bind("focus",function () {
            C();
            p("name");
            G();
            $("#nameDl").attr("class", U);
            $("#mMaskD > .m-mask").hide();
            w(true);
            d.hideRemind("name");
            return false
        }).bind("mouseover",function () {
            $("#nameDl").attr("class", U);
            return false
        }).bind("mouseout",function () {
            if (x != "name") {
                $("#nameDl").attr("class", V)
            }
            return false
        }).bind("keyup",function (W) {
            if (W.keyCode == 13) {
                $("#nameIpt").blur();
                return false
            }
            k.name = true;
            var X = $.trim($("#nameIpt").val());
            if (X == "") {
                d.hideRemind("name");
                G()
            }
            return false
        }).bind("blur", function () {
            $("#nameDl").attr("class", V);
            d.hideRemind("name");
            var Z = $.trim($("#nameIpt").val());
            if (M(Z)) {
                I("name", {result: "empty"});
                return false
            }
            Z = n.toDBC(Z);
            $("#nameIpt").val(Z);
            var Y = $.trim($("#mainPwdIpt").val());
            if (Y == Z) {
                I("name", {result: "eqpwd"});
                d.showRemind("error", "name", "用户名和密码不能完全相同");
                return false
            }
            var X = q.checkName(Z);
            var W = "done";
            switch (X) {
                case 1:
                    L(Z);
                    break;
                case -1:
                    W = "numberstart";
                    o(W, Z);
                    break;
                case -2:
                    W = "tooshort";
                    S("长度应为6~18个字符");
                    break;
                case -3:
                    W = "wrongchar";
                    o(W, Z);
                    break;
                case -4:
                    W = "wrongstart";
                    S("邮件地址必需以英文字母开头");
                    break;
                case -5:
                    W = "wrongend";
                    S("请以英文字母或数字结尾");
                    break;
                case -6:
                    W = "toolong";
                    S("长度应为6~18个字符");
                    break;
                case -7:
                    W = "allnumber";
                    o(W, Z);
                    break;
                case -8:
                    W = "mobilename";
                    S('您填写的是手机号码，将为您注册手机号码邮箱，免费享受更多贴心服务。<br/><br/><a href="javascript:void(0);" onclick="_Global.mobile.turnOn(\'' + Z + "','mobilename');$('#mMaskD > .m-mask').hide();return false;\" class=\"btnSml\" hidefocus=\"true\">继&nbsp;&nbsp;&nbsp;续</a>", true, true);
                    $("#mMaskD > .m-mask").show();
                    w(false);
                    break;
                case -9:
                    W = "longname";
                    o(W, Z);
                    break;
                case -10:
                    W = "shortname";
                    o(W, Z);
                    break
            }
            var aa = Z + "@" + y;
            I("name", {result: W, uid: aa});
            return false
        })
    }, vcode: function (T) {
        D = T.vmap;
        f.initEnv(T.envalue);
        N(T.currDomain);
        $("#vcodeImg,#vcodeA").click(function () {
            l();
            return false
        });
        var U = "regForm-item-focus";
        var W = "regForm-item-focusImpt";
        var V = W + " " + U;
        $("#vcodeIpt").bind("blur",function () {
            $("#vcodeDl").removeClass(V);
            var Y = $.trim($("#vcodeIpt").val());
            var X = q.checkVcode(Y);
            if (X != 0) {
                d.hideRemind("vcode");
                j.vcode = true;
                I("vcode", {result: "done"});
                Y = n.toDBC(Y);
                $("#vcodeIpt").val(Y)
            } else {
                I("vcode", {result: "empty"})
            }
            return false
        }).bind("keyup",function (X) {
            if (X.keyCode == 13) {
                $("#vcodeIpt").blur();
                return false
            }
            k.vcode = true;
            return false
        }).bind("mouseover",function () {
            if (x != "vcode") {
                $("#vcodeDl").removeClass(V).addClass(U)
            }
            return false
        }).bind("mouseout",function () {
            if (x != "vcode") {
                $("#vcodeDl").removeClass(V)
            }
            return false
        }).bind("focus", function () {
            C();
            p("vcode");
            d.hideRemind("vcode");
            $("#vcodeDl").removeClass(V).addClass(W)
        })
    }, domain: function (T) {
        $("#mainDomainSelect").bind("change", function () {
            N($(this).find("option:selected").val());
            $("#nameIpt").blur();
            return false
        })
    }, password: function () {
        $("#mainPwdIpt").bind("focus",function () {
            C();
            p("pwd");
            $("#mainPwdDl").attr("class", "regForm-item regForm-item-focus");
            d.hideRemind("mainPwd");
            B($.trim($("#mainPwdIpt").val()), true);
            return false
        }).bind("mouseover",function () {
            $("#mainPwdDl").attr("class", "regForm-item regForm-item-focus");
            return false
        }).bind("mouseout",function () {
            if (x != "pwd") {
                $("#mainPwdDl").attr("class", "regForm-item")
            }
            return false
        }).bind("keyup",function (T) {
            if (T.keyCode == 13) {
                $("#mainPwdIpt").blur();
                return false
            }
            k.pwd = true;
            B(n.toDBC($.trim($("#mainPwdIpt").val())));
            return false
        }).bind("blur", function () {
            $("#mainPwdDl").attr("class", "regForm-item");
            $("#mainPwdStatus").hide();
            var V = $.trim($("#mainPwdIpt").val());
            if (V == "") {
                I("pwd", {result: "empty"});
                d.hideRemind("mainPwd");
                return false
            }
            V = n.toDBC(V);
            $("#mainPwdIpt").val(V);
            var U = $.trim($("#nameIpt").val());
            if (V.toUpperCase() == U.toUpperCase()) {
                I("pwd", {result: "eqname"});
                d.showRemind("error", "mainPwd", "密码和用户名不能完全相同");
                return false
            }
            var W = {};
            var X = q.checkPassword(V);
            switch (X) {
                case 1:
                    j.pwd = true;
                    var Y = q.checkPasswordStrength(V);
                    switch (Y) {
                        case 1:
                            d.showRemind("success", "mainPwd", "密码强度：弱");
                            break;
                        case 2:
                            d.showRemind("success", "mainPwd", "密码强度：中");
                            break;
                        case 3:
                        case 4:
                            d.showRemind("success", "mainPwd", "密码强度：强");
                            break;
                        default:
                            break
                    }
                    W.result = "done";
                    W.strength = Y;
                    break;
                case -1:
                    W.result = "tooshort";
                    d.showRemind("error", "mainPwd", "密码长度应为6~16个字符");
                    break;
                case -2:
                    d.showRemind("error", "mainPwd", "密码长度应为6~16个字符");
                    W.result = "toolong";
                    break;
                case -3:
                    d.showRemind("error", "mainPwd", "密码必需由英文字母、数字或特殊符号组成");
                    W.result = "wrongchar";
                    break;
                case -4:
                    d.showRemind("error", "mainPwd", "密码过于简单，请尝试“字母+数字”的组合");
                    W.result = "toosimple";
                    break;
                default:
                    break
            }
            I("pwd", W);
            var T = $.trim($("#mainCfmPwdIpt").val());
            if (T != "") {
                $("#mainCfmPwdIpt").blur()
            } else {
                d.hideRemind("mainCfmPwd")
            }
            return false
        })
    }, confirmPassword: function () {
        $("#mainCfmPwdIpt").bind("focus",function () {
            C();
            p("cfmPwd");
            $("#mainCfmPwdDl").attr("class", "regForm-item regForm-item-focus");
            d.hideRemind("mainCfmPwd");
            return false
        }).bind("mouseover",function () {
            $("#mainCfmPwdDl").attr("class", "regForm-item regForm-item-focus");
            return false
        }).bind("mouseout",function () {
            if (x != "cfmPwd") {
                $("#mainCfmPwdDl").attr("class", "regForm-item")
            }
            return false
        }).bind("blur",function (V) {
            $("#mainCfmPwdDl").attr("class", "regForm-item");
            d.hideRemind("mainCfmPwd");
            var U = $.trim($("#mainPwdIpt").val());
            if (!j.pwd && U != "") {
                return false
            }
            var T = $.trim($("#mainCfmPwdIpt").val());
            if (T == "") {
                I("cfmPwd", {result: "empty"});
                if (U != "") {
                    d.showRemind("error", "mainCfmPwd", "请再次填写密码");
                    return false
                }
                d.hideRemind("mainCfmPwd");
                return false
            }
            T = n.toDBC(T);
            $("#mainCfmPwdIpt").val(T);
            if (T == U) {
                d.showRemind("success", "mainCfmPwd", "");
                j.cfmPwd = true;
                I("cfmPwd", {result: "done"})
            } else {
                d.showRemind("error", "mainCfmPwd", "两次填写的密码不一致");
                I("cfmPwd", {result: "notmatch"})
            }
            return false
        }).bind("keyup", function (T) {
            if (T.keyCode == 13) {
                $("#mainCfmPwdIpt").blur();
                return false
            }
            k.cfmPwd = true;
            return false
        })
    }, accept: function () {
        $("#mainAcceptIpt").click(function () {
            if (!$("#mainAcceptIpt").attr("checked")) {
                j.accept = false;
                d.showRemind("error", "mainAccept", "请接受服务条款")
            } else {
                j.accept = true;
                d.hideRemind("mainAccept")
            }
        })
    }};
    this.turnOn = function (T, U) {
        if (_Global.locked) {
            return
        }
        if (T && U) {
            y = U;
            switch (U) {
                case"163.com":
                    $("#mainDomainSelect option:nth-child(1)").attr("selected", "selected");
                    break;
                case"126.com":
                    $("#mainDomainSelect option:nth-child(2)").attr("selected", "selected");
                    break;
                default:
                    $("#mainDomainSelect option:nth-child(3)").attr("selected", "selected");
                    break
            }
            $("#nameIpt").val(T)
        }
        $("#vipAdds126").hide();
        $("#vipAdds163").hide();
        $("#adds").show();
        $("#nameIpt").blur();
        $("#regMobile").hide();
        $("#regVipFrame").hide();
        $("#regMain").show();
        $("#guideMobile").hide();
        $("#guideMain").show();
        $("#tabsUl").attr("class", "tabs1-on");
        _Global.flow = this
    };
    this.init = function (U) {
        if (typeof U.flow != "undefined") {
            O = U.flow
        }
        for (var T in e) {
            e[T](U)
        }
        m = U.from;
        i = U.forcedFlow;
        a = U.targetURL;
        t = U.sid;
        h = U.gw
    };
    function r(T, U) {
        for (var V = 0; V < T.length; V++) {
            var W = $("#" + T[V]);
            U ? W.removeAttr("disabled") : W.attr("disabled", "true")
        }
    }

    function w(T) {
        r(["mainPwdIpt", "mainCfmPwdIpt", "mainMobileIpt", "vcodeIpt", "mainAcceptIpt"], T);
        if (T) {
            $("#mainRegA").show();
            $("#mainRegA_d").hide()
        } else {
            $("#mainRegA").hide();
            $("#mainRegA_d").html("立即注册");
            $("#mainRegA_d").show()
        }
    }

    function z(T) {
        var U = true;
        if (T) {
            U = false;
            $("#mainRegA").hide();
            $("#mainRegA_d").html(T);
            $("#mainRegA_d").show()
        } else {
            $("#mainRegA").show();
            $("#mainRegA_d").hide()
        }
        r(["nameIpt", "mainPwdIpt", "mainCfmPwdIpt", "mainMobileIpt", "vcodeIpt", "mainAcceptIpt"], U);
        _Global.locked = !U
    }

    this.handleMsg = function (T) {
        switch (T.msg) {
            case"INVALID NAME":
                d.showRemind("error", "name", "无效的用户名");
                j.name = false;
                break;
            case"ILLEGAL_UID":
                $("#nameIpt").blur();
                j.name = false;
                break;
            case"NAME_EQUALS_PASSWORD":
                d.showRemind("error", "mainPwd", "密码和用户名不能完全相同");
                j.pwd = false;
                break;
            case"NO_PASSWORD":
                $("#mainPwdIpt").blur();
                j.pwd = false;
                break;
            case"NAME EQUALS PASSWORD":
            case"PASSWORD TOO SIMPLE":
                d.showRemind("error", "mainPwd", "密码过于简单，请尝试“字母+数字”的组合");
                j.pwd = false;
                break;
            case"NO_CONFIRMED_PASSWORD":
            case"PASSWORD_NOT_MATCH":
                $("#mainCfwPwdIpt").blur();
                j.cfmPwd = false;
                break;
            case"INVALID MOBILE":
                d.showRemind("error", "mainMobile", "请填写有效的11位手机号码");
                j.mobile = false;
                break;
            case"BIND TOO MANY":
                d.showRemind("error", "mainMobile", "该手机号码已绑定5个帐号，请编辑短信“JC”发送到 10690163331，取消手机和所有帐号的绑定关系");
                j.mobile = false;
                break;
            case"VCODE_NOT_MATCH":
                d.showRemind("error", "vcode", "验证码不正确，请重新填写");
                if (T.result) {
                    f.initEnv(T.result)
                }
                $("#vcodeImg").click();
                j.vcode = false;
                break;
            case"INVALID_SUSPEND":
            case"REGISTER_NOT_FOUND":
                $("#overdueTips").show();
                break;
            default:
                $("#overdueTips").show();
                break
        }
    };
    this.fieldVal = function (T) {
        switch (T) {
            case"name":
                return $.trim($("#nameIpt").val());
            case"pwd":
                return $.trim($("#mainPwdIpt").val());
            case"cfmpwd":
                return $.trim($("#mainCfmPwdIpt").val());
            case"mobile":
                return $.trim($("#mainMobileIpt").val());
            case"vcode":
                return $.trim($("#vcodeIpt").val());
            default:
                return""
        }
    };
    var A = false;
    var u = {};
    this.getStartParam = function (T) {
        return u[T]
    };
    this.start = function () {
        var X = $.trim($("#nameIpt").val());
        var Y = X + "@" + y;
        var W = $.trim($("#mainPwdIpt").val());
        var V = $.trim($("#mainCfmPwdIpt").val());
        var U = $.trim($("#mainMobileIpt").val());
        var Z = $.trim($("#vcodeIpt").val());
        if (!E()) {
            if (!j.name) {
                if (M(X)) {
                    d.showRemind("error", "name", "请填写邮件地址")
                }
            }
            if (!j.pwd) {
                if (W == "") {
                    d.showRemind("error", "mainPwd", "请填写密码")
                }
            }
            if (!j.cfmPwd) {
                if (V == "") {
                    d.showRemind("error", "mainCfmPwd", "请再次填写密码")
                }
            }
            if (!j.vcode) {
                if (Z == "") {
                    d.showRemind("error", "vcode", "请填写图片中的验证码")
                }
            }
            return false
        }
        z("处理中...");
        var T = "https://ssl.mail.163.com/regall/unireg/call.do;jsessionid=" + t + "?cmd=register.start";
        u = {name: X, flow: O, uid: Y, password: W, confirmPassword: V, mobile: U, vcode: Z, from: m};
        if (i) {
            u.forcedFlow = i
        }
        if (v.supportCORS()) {
            $.ajax({url: T, xhrFields: {withCredentials: true}, type: "POST", data: u, success: function (ab, ac, aa) {
                f.handleStart(ab, aa.status)
            }})
        } else {
            v.formSubmit("submitForm", T + "&reforward=common/reform&targetCmd=register.ctrlTop", "POST", u, {target: "submitFrame"})
        }
    };
    this.handleStart = function (U, T) {
        switch (T) {
            case 200:
                if (typeof U != "object") {
                    U = $.parseJSON(U)
                }
                switch (U.code) {
                    case 200:
                        A = true;
                        com.netease.mail.unireg.register.common.LoginUtils.login("submitForm", u.name, y, u.password, "1", a);
                        break;
                    default:
                        z();
                        f.handleMsg(U);
                        break
                }
                break;
            case 201:
                showSecondarySection(U);
                break;
            default:
                z();
                $("#overdueTips").show();
                break
        }
    };
    this.quit = function () {
        if (!A) {
            b.info({opt: "quit_reg", flow: O, lastField: H})
        }
    }
});
Namespaces.create("com.netease.mail.unireg.register.mobile.Start", function () {
    var M = "mobile";
    var g = this;
    var n = com.netease.mail.common.StringUtils;
    var x = com.netease.mail.common.RequestUtils;
    var p = com.netease.mail.unireg.register.common.CheckUtils;
    var b = com.netease.mail.unireg.register.common.FormLogger;
    var d = com.netease.mail.unireg.register.main.RemindUtils;
    var m;
    var i;
    var l = {};
    var y = null;
    var I = null;
    var N = {};
    var K = false;
    var j = {mobile: false, acode: false, pwd: false, cfmPwd: false, accept: true};
    var A;
    var a;
    var u;
    var z;

    function G() {
        for (var P in j) {
            if (!j[P]) {
                return false
            }
        }
        return true
    }

    function o(P) {
        y = P;
        I = P;
        N[P] = new Date().getTime();
        l[P] = false;
        j[P] = false
    }

    function J(Q, P) {
        y = null;
        if (l[Q] && N[Q]) {
            var R = $.extend({opt: "write_field", flow: M, field: Q}, P);
            R.timecost = new Date().getTime() - N[Q];
            b.info(R)
        }
        N[Q] = false
    }

    function E(S, Q) {
        var P = n.fLen(S);
        var R = p.checkPasswordStrength(S);
        if (-1 == R) {
            $("#mobilePwdStatus").hide();
            if (!Q) {
                d.showRemind("error", "mainPwd", "密码必需由英文字母、数字或特殊符号组成")
            }
            return
        }
        if (P < 6) {
            if (P == 0) {
                d.hideRemind("mobilePwd");
                d.hideRemind("mobileCfmPwd")
            }
            $("#mobilePwdStatus").hide();
            return
        }
        if (P > 16) {
            $("#mobilePwdStatus").hide();
            if (!Q) {
                d.showRemind("error", "mobilePwd", "密码长度应为6~16个字符")
            }
            return
        }
        $("#mobilePwdStatus ").show();
        d.hideRemind("mobilePwd");
        switch (R) {
            case 2:
                $("#mobilePwdStatus").attr("class", "pswState pswState-normal");
                break;
            case 3:
            case 4:
                $("#mobilePwdStatus").attr("class", "pswState pswState-strong");
                break;
            default:
                $("#mobilePwdStatus").attr("class", "pswState pswState-poor");
                break
        }
    }

    this.showRebind = function (P) {
        if (P) {
            $("#rebindSpan").html(P)
        }
        rebindPopup.show()
    };
    var c = false;
    var F = false;
    var r = "163.com";

    function q(P) {
        if (c) {
            return
        }
        c = true;
        $.ajax({url: "/unireg/call.do?cmd=added.mobilemail.checkBinding", type: "POST", data: {mobile: P}, success: function (T, U, R) {
            c = false;
            var S = t;
            t = false;
            switch (R.status) {
                case 200:
                    switch (T.code) {
                        case 200:
                            d.showRemind("success", "mobile", "该号码可注册");
                            j.mobile = true;
                            if (S) {
                                e(P)
                            }
                            break;
                        case 201:
                            F = true;
                            r = A[T.result];
                            var Q = "该号码已被激活";
                            if (T.msg) {
                                Q += "并与&nbsp;" + T.msg + "&nbsp;绑定"
                            }
                            Q += "&nbsp;&nbsp;<a href='javascript:void(0);' onclick='_Global.mobile.showRebind(\"" + P + "@" + r + "\");'>重新激活</a>";
                            d.showRemind("error", "mobile", Q);
                            break;
                        case 202:
                            d.showRemind("error", "mobile", "该邮件地址已存在，不能再注册");
                            break;
                        case 301:
                            d.showRemind("error", "mobile", "请填写有效的11位手机号码");
                            break;
                        default:
                            break
                    }
                    break;
                case 201:
                    showSecondarySection(T);
                    break;
                default:
                    break
            }
        }})
    }

    var H;
    var O = false;
    var h = true;

    function L(P) {
        if (O) {
            window.clearInterval(H)
        }
        h = false;
        $("#mobileIpt").attr("disabled", true);
        $("#sendAcodeStg").html(P);
        $("#sendAcodeBtn").attr("class", "btn-disable");
        $("#sendAcodeBtn").unbind("click");
        $("#sendAcodeBtn").click(function () {
            return false
        })
    }

    function C(Q) {
        if (!h && !O) {
            h = true;
            var P = Q || "免费获取验证码";
            $("#mobileIpt").removeAttr("disabled");
            $("#acodeSentSpan").hide();
            $("#sendAcodeBtn").attr("class", "btn");
            $("#sendAcodeStg").html(P);
            $("#sendAcodeBtn").unbind("click");
            $("#sendAcodeBtn").click(function () {
                e();
                return false
            })
        }
    }

    function v(Q, P) {
        if (O) {
            return
        }
        O = true;
        L("60秒后可重新获取验证码");
        $("#acodeSentSpan").show();
        H = window.setInterval(function () {
            if (--P == 0) {
                O = false;
                C('免费获取验证码<font color="#999">（今天剩余' + Q + "次 ）</font>");
                window.clearInterval(H)
            } else {
                $("#sendAcodeStg").html(P + "秒后可重新获取验证码")
            }
        }, 1000)
    }

    var t = false;

    function e(P) {
        t = c;
        if (t) {
            return
        }
        var R = P || $.trim($("#mobileIpt").val());
        if (!j.mobile) {
            if (R == "") {
                d.showRemind("error", "mobile", "请填写手机号码")
            }
            return
        }
        var Q = R + "@" + r;
        if (F) {
            g.showRebind(Q);
            return
        }
        L("发送中...");
        $.ajax({url: "/unireg/call.do?cmd=added.mobileverify.sendAcode", type: "POST", data: {mobile: R, uid: Q, mark: "mobile_start"}, success: function (T, U, S) {
            switch (S.status) {
                case 200:
                    switch (T.code) {
                        case 200:
                            K = true;
                            v(T.msg, 60);
                            break;
                        case 201:
                            L("每天只能获取3次验证短信");
                            $("#acodeSentSpan").show();
                            $("#mobileIpt").removeAttr("disabled");
                            break;
                        case 202:
                            C();
                            d.showRemind("error", "mobile", "该邮件地址已存在，不能再注册");
                            break;
                        case 301:
                            C();
                            d.showRemind("error", "mobile", "请填写有效的11位手机号码");
                            break;
                        case 401:
                            $("#sendAcodeStg").html("每天只能获取3次验证短信");
                            d.showRemind("error", "mobile", "发送次数达到当天限制");
                            $("#mobileIpt").removeAttr("disabled");
                            break;
                        default:
                            C();
                            d.showRemind("error", "mobile", "获取验证码失败");
                            break
                    }
                    break;
                case 201:
                    showSecondarySection(T);
                    break;
                default:
                    break
            }
        }})
    }

    this.initEnv = function (P) {
    };
    this.recover = function () {
        $("#acodeIpt").val("");
        j.acode = false;
        B();
        C();
        $("#mobileIpt").blur()
    };
    var f = {acode: function () {
        $("#sendAcodeBtn").click(function () {
            e();
            return false
        });
        $("#acodeIpt").bind("focus",function () {
            o("acode");
            $("#acodeDl").attr("class", "regForm-item regForm-item-focus");
            d.hideRemind("acode");
            return false
        }).bind("blur",function () {
            $("#acodeDl").attr("class", "regForm-item");
            var P = $.trim($("#acodeIpt").val());
            if (P != "") {
                J("acode", {result: "done"});
                j.acode = true;
                P = n.toDBC(P);
                $("#acodeIpt").val(P);
                return false
            } else {
                if (K) {
                    d.showRemind("error", "acode", "请填写验证码")
                }
            }
            J("acode", {result: "empty"});
            return false
        }).bind("keyup",function (P) {
            if (P.keyCode == 13) {
                $("#acodeIpt").blur();
                return false
            }
            l.acode = true;
            return false
        }).bind("mouseout",function () {
            if (y != "acode") {
                $("#acodeDl").attr("class", "regForm-item")
            }
            return false
        }).bind("mouseover", function () {
            $("#acodeDl").attr("class", "regForm-item regForm-item-focus");
            return false
        })
    }, password: function () {
        $("#mobilePwdIpt").bind("focus",function () {
            o("pwd");
            $("#mobilePwdDl").attr("class", "regForm-item regForm-item-focus");
            d.hideRemind("mobilePwd");
            E($.trim($("#mobilePwdIpt").val()), true);
            return false
        }).bind("mouseover",function () {
            $("#mobilePwdDl").attr("class", "regForm-item regForm-item-focus");
            return false
        }).bind("mouseout",function () {
            if (y != "pwd") {
                $("#mobilePwdDl").attr("class", "regForm-item")
            }
            return false
        }).bind("keyup",function (P) {
            if (P.keyCode == 13) {
                $("#mobilePwdIpt").blur();
                return false
            }
            l.pwd = true;
            E(n.toDBC($.trim($("#mobilePwdIpt").val())));
            return false
        }).bind("blur", function () {
            $("#mobilePwdDl").attr("class", "regForm-item");
            $("#mobilePwdStatus").hide();
            var R = $.trim($("#mobilePwdIpt").val());
            if (R == "") {
                d.hideRemind("mobilePwd");
                J("pwd", {result: "empty"});
                return false
            }
            R = n.toDBC(R);
            $("#mobilePwdIpt").val(R);
            var Q = $.trim($("#mobileIpt").val());
            if (R.toUpperCase() == Q.toUpperCase()) {
                d.showRemind("error", "mobilePwd", "密码和用户名不能完全相同");
                J("pwd", {result: "eqmobile"});
                return false
            }
            var S = {};
            var T = p.checkPassword(R);
            switch (T) {
                case 1:
                    j.pwd = true;
                    var U = p.checkPasswordStrength(R);
                    switch (U) {
                        case 1:
                            d.showRemind("success", "mobilePwd", "密码强度：弱");
                            break;
                        case 2:
                            d.showRemind("success", "mobilePwd", "密码强度：中");
                            break;
                        case 3:
                        case 4:
                            d.showRemind("success", "mobilePwd", "密码强度：强");
                            break;
                        default:
                            break
                    }
                    S.result = "done";
                    S.strength = U;
                    break;
                case -1:
                    S.result = "tooshort";
                    d.showRemind("error", "mobilePwd", "密码长度应为6~16个字符");
                    break;
                case -2:
                    d.showRemind("error", "mobilePwd", "密码长度应为6~16个字符");
                    S.result = "toolong";
                    break;
                case -3:
                    d.showRemind("error", "mobilePwd", "密码必需由英文字母、数字或特殊符号组成");
                    S.result = "wrongchar";
                    break;
                case -4:
                    d.showRemind("error", "mobilePwd", "密码过于简单，请尝试“字母+数字”的组合");
                    S.result = "toosimple";
                    break;
                default:
                    break
            }
            J("pwd", S);
            var P = $.trim($("#mobileCfmPwdIpt").val());
            if (P != "") {
                $("#mobileCfmPwdIpt").blur()
            } else {
                d.hideRemind("mobileCfmPwd")
            }
            return false
        })
    }, confirmPassword: function () {
        $("#mobileCfmPwdIpt").bind("focus",function () {
            o("cfmPwd");
            $("#mobileCfmPwdDl").attr("class", "regForm-item regForm-item-focus");
            d.hideRemind("mobileCfmPwd");
            return false
        }).bind("mouseover",function () {
            $("#mobileCfmPwdDl").attr("class", "regForm-item regForm-item-focus");
            return false
        }).bind("mouseout",function () {
            if (y != "cfmPwd") {
                $("#mobileCfmPwdDl").attr("class", "regForm-item")
            }
            return false
        }).bind("blur",function (R) {
            $("#mobileCfmPwdDl").attr("class", "regForm-item");
            d.hideRemind("mobileCfmPwd");
            var Q = $.trim($("#mobilePwdIpt").val());
            if (!j.pwd && Q != "") {
                return false
            }
            var P = $.trim($("#mobileCfmPwdIpt").val());
            if (P == "") {
                J("cfmPwd", {result: "empty"});
                if (Q != "") {
                    d.showRemind("error", "mobileCfmPwd", "请再次填写密码");
                    return false
                }
                d.hideRemind("mobileCfmPwd");
                return false
            }
            P = n.toDBC(P);
            $("#mobileCfmPwdIpt").val(P);
            if (P == Q) {
                d.showRemind("success", "mobileCfmPwd", "");
                j.cfmPwd = true;
                J("cfmPwd", {result: "done"})
            } else {
                d.showRemind("error", "mobileCfmPwd", "两次填写的密码不一致");
                J("cfmPwd", {result: "notmatch"})
            }
            return false
        }).bind("keyup", function (P) {
            if (P.keyCode == 13) {
                $("#mobileCfmPwdIpt").blur();
                return false
            }
            l.cfmPwd = true;
            return false
        })
    }, mobile: function (P) {
        $("#mobileIpt").bind("focus",function () {
            o("mobile");
            F = false;
            $("#mobileDl").attr("class", "regForm-item regForm-item-focus");
            d.hideRemind("mobile");
            return false
        }).bind("blur",function () {
            $("#mobileDl").attr("class", "regForm-item");
            var R = $.trim($("#mobileIpt").val());
            R = n.toDBC(R);
            $("#mobileIpt").val(R);
            var Q = p.checkMobile(R);
            switch (Q) {
                case 0:
                    J("mobile", {result: "empty"});
                    return false;
                case -1:
                    d.showRemind("error", "mobile", "请填写有效的11位手机号码");
                    J("mobile", {result: "wrong"});
                    break;
                case 1:
                    q(R);
                    J("mobile", {result: "done"});
                    break
            }
            return false
        }).bind("keyup",function (Q) {
            C();
            if (Q.keyCode == 13) {
                $("#mobileIpt").blur();
                return false
            }
            l.mobile = true;
            return false
        }).bind("mouseover",function () {
            $("#mobileDl").attr("class", "regForm-item regForm-item-focus");
            return false
        }).bind("mouseout", function () {
            if (y != "mobile") {
                $("#mobileDl").attr("class", "regForm-item")
            }
            return false
        });
        $("#rebindA").click(function () {
            F = false;
            j.mobile = true;
            rebindPopup.hide();
            d.hideRemind("mobile");
            $("#sendAcodeBtn").click();
            return false
        })
    }, accept: function () {
        $("#mobileAcceptIpt").click(function () {
            if (!$("#mobileAcceptIpt").attr("checked")) {
                j.accept = false;
                d.showRemind("error", "mobileAccept", "请接受服务条款")
            } else {
                j.accept = true;
                d.hideRemind("mobileAccept")
            }
        })
    }};
    var k = false;
    this.turnOn = function (P, Q) {
        if (_Global.locked) {
            return
        }
        if (P) {
            $("#mobileIpt").val(P);
            $("#mobileIpt").blur()
        }
        $("#vipAdds126").hide();
        $("#vipAdds163").hide();
        $("#adds").show();
        $("#regMain").hide();
        $("#regVipFrame").hide();
        $("#regMobile").show();
        $("#guideMain").hide();
        $("#guideMobile").show();
        $("#tabsUl").attr("class", "tabs2-on");
        z = Q;
        _Global.flow = this;
        if (!k) {
            k = true;
            b.info({opt: "turn_on", flow: M, pos: Q})
        }
    };
    this.init = function (Q) {
        if (typeof Q.flow != "undefined") {
            M = Q.flow
        }
        for (var P in f) {
            f[P](Q)
        }
        m = Q.from;
        i = Q.forcedFlow;
        a = Q.targetURL;
        A = Q.boundDomains;
        u = Q.sid
    };
    this.fieldVal = function (P) {
        switch (P) {
            case"name":
                return $.trim($("#mobileIpt").val());
            case"pwd":
                return $.trim($("#mobilePwdIpt").val());
            case"cfmpwd":
                return $.trim($("#mobileCfmPwdIpt").val());
            case"acode":
                return $.trim($("#acodeIpt").val());
            default:
                return""
        }
    };
    function s(P, Q) {
        for (var R = 0; R < P.length; R++) {
            var S = $("#" + P[R]);
            Q ? S.removeAttr("disabled") : S.attr("disabled", "true")
        }
    }

    function B(P) {
        var Q = true;
        if (P) {
            Q = false;
            $("#mobileRegA").hide();
            $("#mobileRegA_d").html(P);
            $("#mobileRegA_d").show()
        } else {
            $("#mobileRegA").show();
            $("#mobileRegA_d").hide()
        }
        s(["mobileIpt", "mobilePwdIpt", "mobileCfmPwdIpt", "acodeIpt"], Q);
        _Global.locked = !Q
    }

    this.handleMsg = function (P) {
        switch (P.msg) {
            case"WRONG MOBILE":
            case"ILLEGAL_UID":
            case"INVALID NAME":
                d.showRemind("error", "mobile", "无效手机号");
                j.mobile = false;
                break;
            case"EXCESSIVE ATTEMPTS":
                d.showRemind("error", "mobile", "验证尝试次数过多");
                j.mobile = false;
                break;
            case"MUID ALIASED":
                d.showRemind("error", "mobile", "该邮件地址已存在，不能再注册");
                j.mobile = false;
                break;
            case"MUID_EXIST":
                d.showRemind("error", "mobile", "该邮件地址已存在，不能再注册");
                j.mobile = false;
                break;
            case"NAME_EQUALS_PASSWORD":
                d.showRemind("error", "mobilePwd", "密码和用户名不能完全相同");
                j.pwd = false;
                break;
            case"NO_PASSWORD":
                $("#mobilePwdIpt").blur();
                j.pwd = false;
                break;
            case"NAME EQUALS PASSWORD":
            case"PASSWORD TOO SIMPLE":
                d.showRemind("error", "mobilePwd", "密码过于简单");
                j.pwd = false;
                break;
            case"NO_CONFIRMED_PASSWORD":
            case"PASSWORD_NOT_MATCH":
                $("#mobileCfmPwdIpt").blur();
                j.cfmPwd = false;
                break;
            case"BIND TOO MANY":
                d.showRemind("error", "mobile", "手机绑定次数过多");
                j.mobile = false;
                break;
            case"ILLEGAL_VERIFY":
            case"WRONG ACODE":
            case"NOT PASS":
                d.showRemind("error", "acode", "验证码不正确，请重新填写");
                j.acode = false;
                break;
            case"VERIFY_ACODE_NORETURN":
                d.showRemind("error", "acode", "验证码校验失败，请重新填写");
                j.acode = false;
                break;
            case"INVALID_SUSPEND":
            case"REGISTER_NOT_FOUND":
                $("#overdueTips").show();
                break;
            default:
                $("#overdueTips").show();
                break
        }
    };
    var D = false;
    var w = {};
    this.getStartParam = function (P) {
        return w[P]
    };
    this.start = function () {
        var T = $.trim($("#mobileIpt").val());
        var U = T + "@163.com";
        var V = $.trim($("#acodeIpt").val());
        var S = $.trim($("#mobilePwdIpt").val());
        var R = $.trim($("#mobileCfmPwdIpt").val());
        var Q = true;
        if (!G()) {
            if (!j.mobile) {
                if (T == "") {
                    d.showRemind("error", "mobile", "请填写手机号码")
                }
            }
            if (!j.acode) {
                if (V == "") {
                    d.showRemind("error", "acode", "请填写短信验证码")
                }
            }
            if (!j.pwd) {
                if (S == "") {
                    d.showRemind("error", "mobilePwd", "请填写密码")
                }
            }
            if (!j.cfmPwd) {
                if (R == "") {
                    d.showRemind("error", "mobileCfmPwd", "请再次填写密码")
                }
            }
            return false
        }
        B("处理中...");
        var P = "https://ssl.mail.163.com/regall/unireg/call.do;jsessionid=" + u + "?cmd=register.start";
        w = {flow: M, mobile: T, uid: U, acode: V, mark: "mobile_start", password: S, confirmPassword: R, uapw: Q, from: m, pos: z};
        if (i) {
            w.forcedFlow = i
        }
        if (x.supportCORS()) {
            $.ajax({url: P, xhrFields: {withCredentials: true}, type: "POST", data: w, success: function (X, Y, W) {
                g.handleStart(X, W.status)
            }})
        } else {
            x.formSubmit("submitForm", P + "&reforward=common/reform&targetCmd=register.ctrlTop", "POST", w, {target: "submitFrame"})
        }
    };
    this.handleStart = function (Q, P) {
        switch (P) {
            case 200:
                if (typeof Q != "object") {
                    Q = $.parseJSON(Q)
                }
                switch (Q.code) {
                    case 200:
                        D = true;
                        com.netease.mail.unireg.register.common.LoginUtils.login("submitForm", w.mobile, "163.com", w.password, "1", a);
                        break;
                    default:
                        B();
                        g.handleMsg(Q);
                        break
                }
                break;
            case 201:
                showSecondarySection(Q);
                break;
            default:
                B();
                $("#overdueTips").show();
                break
        }
    };
    this.quit = function () {
        if (!D) {
            b.info({opt: "quit_reg", flow: M, lastField: I})
        }
    }
});
Namespaces.create("com.netease.mail.unireg.register.vip.Start", function () {
    this.turnOn = function () {
        var a = $("#mainDomainSelect").find("option:selected").text();
        if (_Global.locked) {
            return
        }
        $("#regMain").hide();
        $("#regMobile").hide();
        if (a == "126.com") {
            $("#adds").hide();
            $("#vipAdds126").show();
            $("#vipAdds163").hide();
            $("#regVipFrameId").attr("src", "http://mimg.vip.163.com/mailreg-entry/vip_reg_126.html");
            $("#regVipFrame").show()
        } else {
            $("#adds").hide();
            $("#vipAdds163").show();
            $("#vipAdds126").hide();
            $("#regVipFrameId").attr("src", "http://mimg.vip.163.com/mailreg-entry/vip_reg_163.html");
            $("#regVipFrame").show()
        }
        $("#guideMain").hide();
        $("#guideMobile").show();
        $("#tabsUl").attr("class", "tabs3-on");
        _Global.flow = this
    }
});