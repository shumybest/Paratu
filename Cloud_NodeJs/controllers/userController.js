function UserController(){
	//inherit Controller
    var Controller = require("../controllers/Controller");
    Controller.call(this);
    
    var model = this.model;

	this.login = function(obj,sock){
		model.doLogin(obj,function(result){
			if(result=="input empty"){
				sock.write("{res:'name or password can not be empty'}\n");
			}else if(result=="can login"){
				sock.write("{res:'login success'}\n");
			}//else if(result=="need active"){
			//	redirect.response("","{res:'need active in your email'}",sock);
			//}
			else{
				sock.write("{res:'name or password is error'}\n");
			}
		});
	};

    
    this.register = function(obj,sock){  
    	model.doReg(obj,function(result){
			if(result=="input empty"){
				sock.write("{res:'name or password can not be empty'}\n");
			}else if(result=="email format error"){
				sock.write("{res:'error email address format'}\n");
			}else if(result=="username error"){
				sock.write("{res:'username must user 0-9,a-z,A-Z'}\n");
			}else if(result=="username length error"){
				sock.write("{res:'username length must bigger than 5'}\n");
			}else if(result=="have used"){
				sock.write("{res:'register error for username or email has been used'}\n");
			}else if(result=="error"){
				sock.write("{res:'register error'}\n");
			}else if(result=="success"){
				sock.write("{res:'register success,please active your account'}\n");
			}
		});
    }
    
    this.changePassword = function(obj,sock){
    	model.doResetPassword(obj,function(result){
			if(result=="input empty"){
				sock.write("{res:'email or password can not be empty'}\n");
			}else if(result=="email format error"){
				sock.write("{res:'error email address format'}\n");
			}else if(result=="error"){
				sock.write("{res:'reset password error'}\n");
			}else if(result=="success"){
				sock.write("{res:'reset password success'}\n");
			}
		});
    }
    
    this.findPassword = function(obj,sock){
    	var email = model.validator.trim(obj.email);
    	if(model.validator.isNull(email)){    
        	sock.write("{res:'email can not be empty'}\n");
    	}else if(! model.validator.isEmail(email)){
    		sock.write("{res:'error email address format'}\n");
    	}else{
    		var query_doc = {email:email};
        	var option = {password:1,_id:0};
        	model.find(model.modelDB,query_doc,option,function(err,res){
    			if(res){ 
    				var password = model.crypto.decrypt(res.password,model.config.secret);
    				sock.write("{res:'"+password+"'}\n");
    			}else{
    				sock.write("{res:'your email is error'}\n");
    			}
    		});
    	}
    }

}
module.exports = new UserController();