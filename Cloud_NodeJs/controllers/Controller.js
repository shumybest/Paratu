function Controller(){
	var Factory = require("../public/Factory").Factory;
    var obj = Factory.jsonObj;
    this.model = Factory.setModel(obj.module);
     
    this.run = function(obj,sock){
        var method = obj.action;
        eval("this."+method+"(obj,sock);");
    }
}

module.exports = Controller;
