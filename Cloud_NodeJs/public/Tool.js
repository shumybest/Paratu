exports.findPagination = function(obj,modelDB,sortOption,callback) {
	var query = obj.search||{}; 
	var col = obj.columns;   
	var pageinfo = {limit:10,num:1};
	var pageNumber = pageinfo.num||1;  
	var resultsPerPage = pageinfo.limit||10;   

	var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage; 
	var queryResult = modelDB.find(query,col).sort({sortOption:1}).skip(skipFrom).limit(resultsPerPage);
	
	queryResult.exec(function(error, results) {
		console.log(results);
	    if (error) {
	      callback(error, null, null);
	    }else {
	    	modelDB.count(query, function(error, count) {
	    		if (error) {
	    			callback(error, null, null);
	  	        } else {
	  	        	var pageCount = Math.ceil(count / resultsPerPage);
	  	        	callback(null, pageCount,pageinfo,results);
	  	        }
	      });
	    }
	});
};


exports.getRandomNum = function(num){
	var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var res = "";
    for(var i = 0; i < num ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return res;
};

exports.dataAchieve = function(data){
	var buffers = [];
	var nread =0;

	buffers.push(data);
	nread += data.length;
	
	var buffer = Buffer.concat(buffers, nread);
	//var datas = buffer.toString();
	
	/*switch(buffers.length){
		case 0:
			buffer = new Buffer(0);
			break;
		case 1:
			buffer = buffers[0];
			break;
		default:	
			buffer = new Buffer(nread);
			for (var i = 0,pos = 0,l=buffers.length;i<l;i++){
				var chunk = buffers[i];
				chunk.copy(buffer,pos);
				pos += chunk.length;
			}
			break;
	}*/
	return buffer;
};

exports.timeAchieve = function(){
	var date = new Date();
    var month = date.getMonth() + 1;     
    var oneday = date.getDate();            
    var hour = date.getHours();

	if(month<10){
		month="0"+month;
	}
	if(oneday<10){
		oneday="0"+oneday;
	}
	day = date.getFullYear() + "-" + month + "-" + oneday;
	month = date.getFullYear() + "-" + month;
	
	var time = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes(); 
	var timestamp = date.getTime();
	
	var getTimestamp = function(day){
		//var re = /(\d{4})(?:-(\d{1,2}))(?:-(\d{1,2}))?(?:-(\d{1,2}))?(?:-(\d{1,2}))?/.exec(day);
		var re = /(\d{4})(?:-(\d{1,2}))(?:-(\d{1,2}))?(?:[-\s](\d{1,2}))?(?:[-:](\d{1,2}))?/.exec(day);
		return new Date(re[1],(re[2]||1)-1,re[3]||1,re[4]||0,re[5]||0).getTime();
	}
	
	var dayInMonth = function(month,year){ 
		var dataArr = [
		               	[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], 
		               	[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		              ]; 
		var leap = ((year % 4 === 0 && year % 100 !== 0) || year % 400);
		if(typeof(leap) === "boolean"){
			return dataArr[1][month-1];
		}else{
			return dataArr[0][month-1];
		}
	}

    return {time:time,day:day,month:month,hour:hour,timestamp:timestamp,getTimestamp:getTimestamp,dayInMonth:dayInMonth};
};

exports.unescape = function(str){
	return unescape(str.replace(/&#x/g,'%u').replace(/;/g,'')).toString();
};


exports.pagination = function(count){
	var page = {limit:10,num:1};
	var resultsPerPage = page.limit;  //5
	var pageCount = Math.ceil(count / resultsPerPage);
	
	page['pageCount']=pageCount;
	page['numberOf']=pageCount>10?10:pageCount;
	return page;
};


exports.sleep = function(ms){
	var startTime = new Date().getTime();
    while(new Date().getTime()<startTime+ms);
};

exports.distinct = function(value){
	var info = [];
	var hash = {};    
	for(var i = 0; i < value.length; i++) 
	    hash[value[i]] == undefined && (hash[value[i]] = value[i]);
	for(var o in hash){
		info.push(hash[o]);
	}
	return info;
};


exports.inArray = function(arr, val){
	var ret = false, len = arr.length; 
	for (var i = 0; i < len; i++) { 
		if (arr[i] === val) {
			ret = true; 
			break; 
	    } 
	} 
	return ret; 
};   




