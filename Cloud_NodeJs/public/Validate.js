exports.isNullString = function(arr){
    for (var key in arr){
    	if(arr[key].replace(/(^\s*)|(\s*$)/g, "")==""){
    		return false;
    	}
    }
   return true;
};

exports.handleParam = function(req){
	console.log(req.check('test@email.com', 'Please enter a valid email').len(6, 64).isEmail());       
 /*  var params = params || {};
   var safeParam = {};
   for(var key in params){
	   console.log(params[key]);
	   
      var trimed = sanitize(params[key]).xss();
      var blockXssed = sanitize(trimed).xss();
      safeParam[key] = blockXssed;
   }
   return safeParam;*/
};
