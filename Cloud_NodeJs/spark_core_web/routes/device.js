/**
 *  Function: Device Management
 *
 */

var deviceModel = require("../../models/deviceModel");

exports.deviceAdd = function (req, res) {
    if (req.params.device) {  //update 即如果传递过来设备的id号的话可以认为是编辑或查看
        return res.render('device', {
            label: '编辑设备:' + req.params.device,
            device: req.params.device
        });

        //<textarea id="c_editor" name="c_editor" rows="10" <%= (movie?'"movie='+movie+'"':'') %>></textarea>     <% 'action="/u/'+user+'"' %>
        //value="<%=search.type||''%>">
    } else {
        return res.render('device', {
            label: '新增加设备',
            device: false
        });
    }
};

exports.read = function (req, res) {
    deviceModel.doRead(req.params, function (result) {
        return res.render('device/detail', {
            device: result
        });
    });
};


exports.search = function (req, res) {
    deviceModel.doSerach(req.body, function (result) {
        if (result == "error") {
            req.session.error = '设备不存在';
            return res.render('user', {
                devices: {},
                page: {}
            });
        } else {
            if (req.query.p) {
                result.page['num'] = req.query.p < 1 ? 1 : req.query.p;
            }
            return res.render('user', {
                devices: result.devices,
                page: result.page
            });
        }
    });
};

exports.ajaxupdate = function (req, res) {
    var action = req.body.action;
    var coreid = req.body.coreid;
    var update_doc;
//    console.log(req.body);

    if("poweron" == action) {
        update_doc = {coreid: coreid, value: 1};
    } else if ("poweroff" == action) {
        update_doc = {coreid: coreid, value: 0};
    } else {
        res.send("unknow action");
        return;
    }

    if("delete" == action) {
        console.log("TODO:" + action + " " + coreid);
    }

    console.log(update_doc);
    deviceModel.doUpdate(update_doc, function(result) {
        res.send(result);
    })
};
