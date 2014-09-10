/*var moment = require('moment');
console.log(moment().format());
console.log(moment().format('dddd, MMMM Do YYYY, h:mm:ss a'));
var halloween = moment([2011, 9, 31]); // October 31st console.log(halloween.fromNow());
//console.log(halloween);
//console.log(moment("2014-5-16-20-30").hour());
console.log(moment().dates());

console.log(moment().toArray());

var a = moment([2008, 6]);
var b = moment([2007, 0]);
console.log(a.diff(b, 'months'));       // 1
console.log(a.diff(b, 'months', true)); // 1.5
*/


var os = require('os');
var ifaces = os.networkInterfaces();
var reg = /192/;
var HOST;

if('Local Area Connection' in ifaces ){
	con = ifaces['Local Area Connection'][0];
}else if('Wireless Network Connection' in ifaces){
	con = ifaces['Wireless Network Connection'][0];
}
//HOST = con.address; 
HOST = "127.0.0.1";
//HOST = "192.168.0.104";
var net = require('net');

//var HOST = '172.24.227.39';
//var HOST = '192.168.0.104';
var PORT = "8888";
//var PORT = "5683";
var client = new net.Socket();
client.connect(PORT, HOST, function() {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据 
   /* {
    	  "module": "device",
    	  "object": {
    	    "action": "create",
    	    "type": "aircondition",
    	    "instance": [
    	        {"value": {
    	            "mode": "heat",
    	            "temp": "28",
    	            "windlevel": "auto"
    	            }
    	        },
    	*/ 
    var tool = require('./public/Tool');
    var time = tool.timeAchieve().time;
    
    var info = new Buffer(18);
	 info[0]=0x00;
	 info[1]=0x04;
	 info[2]=0x60;
	 info[4]=0x10;
	 info[5]=0x20;
	 info[6]=0x30;
	 info[7]=0x40;
	 info[8]=0x50;
	 info[9]=0x60;
	 info[10]=0x70;
	 info[11]=0x80;
	 info[12]=0x90;
	 info[13]=0x21;
	 info[14]=0x22;
	 info[15]=0x23;
	 info[16]=0x24;
	 info[17]=0x25;
	 //client.write(info);
	 

//client.write('{module:"ifttt",object:{action:"create",owner:"liuchao",trigger:{type:"dateTimer",time:"2014-5-16-19-07",repeat:1},active:{type:"device",value:"50ff6e065067545631120587",operation:"on"}}}');
	 

    //先按一天一次给cloud发过去
//client.write('{module:"electric",object:{action:"sendElectric",coreid:"9876543213",value:16}}');

	 
//client.write('{module:"device",object:{action:"iftttTimer",coreid:"50ff6e065067545631120587",timer:["2014-5-8-12-03","2014-5-8-12-04"]}}');
    
//client.write('{module:"electric",object:{action:"presentElectric",info:[{coreid:"9876543212",devicename:"light1"},{coreid:"9876543213",devicename:"light2"}],day:"2014-5-7"}}');

	// 针对一个设备多天的 
//client.write('{module:"electric",object:{action:"showElec",coreid:["9876543213"],startday:"2014-05-09",endday:"2014-05-14"}}');
	//针对多个设备一天的
	//client.write('{module:"electric",object:{action:"showElec",coreid:["9876543212","9876543213"],startday:"2014-05-09",endday:"2014-05-09"}}');
	
	 
	 
	 //针对多个设备多天的
//client.write('{module:"electric",object:{action:"showElec",type:"hour",coreid:["9876543212","9876543213"],startday:"2014-05-16",endday:"2014-05-16"}}');
				   
	//针对多个设备多天的小时
	//client.write('{module:"electric",object:{action:"showElec",coreid:["9876543212","9876543213"],startday:"2014-05-15-02",endday:"2014-05-17-10"}}');
		
	//针对多个设备多天的   天累加
//client.write('{module:"electric",object:{action:"showElec",type:"day",coreid:["9876543212","9876543213"],startday:"2014-05-10",endday:"2014-05-19"}}');
	

//针对多个设备多天的  月总使用量
client.write('{module:"electric",object:{action:"showElec",type:"month",coreid:["9876543212","9876543213"],startday:"2014-05-01",endday:"2014-8-01"}}');
	
	 
	 // client.write('{module:"device",object:{action:"presentElectric",id:"9876543212",yearmonth:"2014-4"}}');
//client.write('{module:"device",object:{action:"create",owner:"liuchao",devicename:"liu\'s light2",coreid:"9876543213"}}');
   	        
//client.write('{module:"device",object:{action:"create",type:"aircondition",owner:"liuchao",devicename:"我的空调",instance:{mode:"heat",temp:28,windlevel:"auto"}}}');
//client.write('{module:"device",object:{action:"create",type:"light",owner:"liuchao",devicename:"light6",instance:{value:"on"}}}');
   // client.write('{module:"device",object:{action:"create",type:"light",owner:"liuchao",devicename:"light2"}}');
// client.write('{module:"device",object:{action:"delete",type:"aircondition",owner:"liuchao",id:31}}');
 // client.write('{module:"device",object:{action:"update",type:"aircondition",id:6,instance:{mode:"cold",temp:20,windlevel:"auto"}}}');
//client.write('{module:"device",object:{action:"update",coreid:"987654321",isConnect:true}}');
 //  client.write('{module:"device",object:{action:"update",coreid:"9876543212",value:0}}');
  
    
 //client.write('{module:"device",object:{action:"delete",owner:"liuchao",id:"987654321"}}');
  // client.write('{module:"device",object:{action:"search",username:"liuchao",devicename:"light"}}');

 // client.write('{module:"device",object:{action:"read",id:"987654321"}}');
  
//client.write('{module:"user",object:{action:"findAll",username:"liuchao"}}');
//client.write('{module:"device",object:{action:"read",type:"aircondition",id:1}}');
//client.write('{module:"user",object:{action:"login",username:"liuchao",password:"asb#1234"}}');
   //client.write('{module:"user",object:{action:"forgetPassword",username:"15821986820",password:"liuch000"}}');

//client.write('{module:"user",object:{action:"register",username:"liuchao",password:"asb#1234",email:"liuchao1986105@163.com"}}');
    
   //client.write('{module:"user",object:{action:"findPassword",email:"liuchao1986105@163.com"}}');
  // client.write('{module:"user",object:{action:"changePassword ",email:"liuchao1986105@163.com",password:"asb#1234"}}');

//client.write('{module:"user",object:{action:"publish",username:"liuchao",title:"Paratu",content:"this is a good thing!"}}');

    //var PUBLIC_KEY = fs.readFileSync(__dirname + "/blort.pub");

});

// 为客户端添加“data”事件处理函数
// data是服务器发回的数据
client.on('data', function(data) {

    console.log('DATA: ' + data);
    //console.log(data);
    // 完全关闭连接
   // client.destroy();

});

// 为客户端添加“close”事件处理函数
//client.on('close', function() {
  //  console.log('Connection closed');
///});

