function UserModel() {
    this.validator = require('validator');
    this.crypto = require("../public/Crypto");
    this.config = require("../configs/config");

    //inherit DB
    var dbConnect = require("../public/DB");
    dbConnect.call(this);
    
    this.modelDB = this.getUserModel();
}

UserModel.prototype.getUserModel = function () {
    try {
        if (this.mongoose.model('Sc_user')) {
            return this.mongoose.model('Sc_user');
        }
    } catch (e) {
        if (e.name === 'MissingSchemaError') {
            var Sc_userSchema = new this.mongoose.Schema({
                name: {type: String, index: true},
                password: String,
                phoneNO: String,
                email: {type: String, unique: true},
                active: String,
               // deviceID: []
            });

            return this.mongoose.model('Sc_user', Sc_userSchema);
        }
    }
}

UserModel.prototype.doLogin = function (request, callback) {
	var self = this;
    var name = this.validator.trim(request.username);
    var password = this.validator.trim(request.password);

    if (this.validator.isNull(name) || this.validator.isNull(password)) {
        callback("input empty");
    } else {
        var password = this.crypto.encrypt(password, this.config.secret);
        //var query_doc = {$or:[{name:name,password:password},{email:name,password:password}]};
        var query_doc = {name: name, password: password};
        this.isFinded(self.modelDB, query_doc, function (err, res) {
            /*if(res && res.active == "false"){
             callback("need active");
             }else if(res && res.active == "true"){
             callback("can login");
             }else{
             callback("error");
             }*/
            if (!res) {
                callback("error")
            } else {
                callback("can login");
            }
        });
    }
};

UserModel.prototype.doReg = function (request, callback) {
	var self = this;
    var name = this.validator.trim(request.username);
    var password = this.validator.trim(request.password);
    var email = this.validator.trim(request.email);

    if (this.validator.isNull(name) || this.validator.isNull(password) || this.validator.isNull(email)) {
        callback("input empty");
    } else if (!this.validator.isEmail(email)) {
        callback("email format error");
    } else if (!this.validator.isAlphanumeric(name)) {
        callback("username error");
    } else if (name.length < 5) {
        callback("username length error");
    } else {
        var password = this.crypto.encrypt(password, this.config.secret);
        var query_doc = {$or: [
            {name: name},
            {email: email}
        ]};

        this.isFinded(self.modelDB, query_doc, function (err, res) {
            if (res) {
                callback("have used");
            } else {
                var insert_doc = {name: name, password: password, email: email, active: 'false'};
                self.insert(self.modelDB, insert_doc, function (res) {
                	if(res.status=="success"){
                		  var mail = require("../public/Mail");
                          //mail.sendActiveMail(email, crypto.encrypt(email,config.secret),name);
                	}
                    callback(res.status);
                });
            }
        });
    }
};


/*******
 * Function: Active account by web link saved in your email
 * Operation:  Update "active" in MongoDB-Sc_Users with "true".
 * CheckRule:
 *  - Active account will not be active twice
 *  - Wrong account info will not result in active operation
 */
UserModel.prototype.doActiveCount = function (request, callback) {
    var key = request.key;
    var name = request.name;
    var self = this;
    var query_doc = {name: name};

    this.isFinded(self.modelDB, query_doc, function (err, user) {
        if (!user || (user.password !== key)) {
            callback("info error");
        } else if (user.active === 'true') {
            callback("account had been active");
        } else {
            var updateContent = {$set: {active: 'true'}};
            self.update(self.modelDB, query_doc, updateContent, function (res) {
            	callback(res);
            });
        }
    });
};

UserModel.prototype.doChangePassword = function (request, callback) {
	var self = this;
    var name = this.validator.trim(request.username);
    var password = this.validator.trim(request.password);
    var new_pass = this.validator.trim(request.new_password);

    if (this.validator.isNull(password) || this.validator.isNull(new_pass)) {
        callback("input empty");
    } else {
        var password = this.crypto.encrypt(password, this.config.secret);
        var new_pass = this.crypto.encrypt(new_pass, this.config.secret);
        var query_doc = {name: name, password: password};

        this.isFinded(self.modelDB, query_doc, function (err, res) {
            if (!res) {
                callback("login error");
            } else {
                var update_doc = {name: name};
                var updateContent = {$set: {password: new_pass}};

                self.update(self.modelDB, update_doc, updateContent, function(res) {
                	callback(res);
                });
            }
        });
    }
};

UserModel.prototype.doResetPassword = function (request, callback) {
	var self = this;
    var name = this.validator.trim(request.username);
    var email = this.validator.trim(request.email);
    var password = this.validator.trim(request.new_password);
    if (this.validator.isNull(name) || this.validator.isNull(email) || this.validator.isNull(password)) {
        callback("input empty");
    } else if (!this.validator.isEmail(email)) {
        callback("email format error");
    } else {
        var update_doc = {name: username, email : email};
        var cryptopassword = this.crypto.encrypt(password, this.config.secret);
        var updateContent = {$set: {password: cryptopassword}};
         this.update(self.modelDB, update_doc, updateContent, function (res) {
        	 callback(res);
        });
    }
};

UserModel.prototype.doForgetPassword = function(request, callback) {
	var self = this;
    var username = this.validator.trim(request.username);
    var email = this.validator.trim(request.email);
    if(this.validator.isNull(email) || this.validator.isNull(username))
    {
        callback("input empty", "");
    } else {
        var query_doc = {name: username, email : email};
        this.isFinded(self.modelDB, query_doc, function(err, res){
            if(!res){
                callback("user not exist", res);
            } else {
                callback("success", res);
            }
        });
    }
};

module.exports = new UserModel();
