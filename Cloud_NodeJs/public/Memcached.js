var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');
var dummy = function dummy(error, ok) { };
//var lifetime = 86400; //24hrs

/*memcached.set('hello', 'world', lifetime, function( err, result ){
  if( err ) console.error( err );
  console.dir( result );
});
memcached.get('hello', function( err, result ){
  if( err ) console.error( err );
  console.dir( result );
});

/*var memcached = require("../public/Memcached");
	//memcached.set("ifttts",self.ifttt,24*30);
	memcached.get('ifttts', function (err, data) {
		  console.log(JSON.parse(data));
});*/


module.exports = {  
		set: function addToCache(key, val, expire, callback) {  
	        if (!expire) expire = 5 * 60;  
	        if (!callback) callback = dummy;  
	        memcached.set(key, val, expire, callback);  
	    },  
	  
	    get: function getFromCache(key, callback) {  
	        if (!callback) callback = dummy;  
	        memcached.get(key, function(err,result){
	        	callback(err,result);
	        });  
	    },  
}; 

