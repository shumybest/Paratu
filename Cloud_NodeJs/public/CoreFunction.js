exports.turnOn = function() {
	var info = new Buffer(30);
	 info[0]=0x00;
	 //info[1]=0x1b;
	 info[1]=0x1c;
	 info[2]=0x41;  
	 info[3]=0x02;
	 info[4]=0x00;   //message_id
	 info[5]=0x00;
	 info[6]=0x00;  //token; 
	 //info[7]=0xb1;
	 info[7]=0x31;
	 info[8]=0x66;  //f
	 info[9]=0x3c;  
	 //info[9]=0xbc;  
	 info[10]=0x64;  //d
	 info[11]=0x69;   //i
	 info[12]=0x67;   //g
	 info[13]=0x69;   //i
	 info[14]=0x74;   //t
	 info[15]=0x61;   //a
	 info[16]=0x6c;   //l
	 info[17]=0x77;   //w
	 info[18]=0x72;   //r
	 info[19]=0x69;   //i
	 info[20]=0x74;   //t
	 info[21]=0x65;   //e
	 //info[22]=0xb7;
	 //info[22]=0x36; 
	 info[22]=0x37; 
	 info[23]=0x44;   //D
	 info[24]=0x37;   //7
	 info[25]=0x2c;   //,
	 info[26]=0x48;   //H
	 info[27]=0x49;   //I
	 info[28]=0x47;  //G
	 info[29]=0x48;   //H 
	 return info;
};


exports.turnOff= function(){
	var info = new Buffer(29);
	 info[0]=0x00;
	 info[1]=0x1b;
	 info[2]=0x41;  
	 info[3]=0x02;
	 info[4]=0x00;   //message_id
	 info[5]=0x00;
	 info[6]=0x00;  //token; 
	 //info[7]=0xb1;
	 info[7]=0x31;
	 info[8]=0x66;  //f
	 info[9]=0x3c;  
	 //info[9]=0xbc;  
	 info[10]=0x64;  //d
	 info[11]=0x69;   //i
	 info[12]=0x67;   //g
	 info[13]=0x69;   //i
	 info[14]=0x74;   //t
	 info[15]=0x61;   //a
	 info[16]=0x6c;   //l
	 info[17]=0x77;   //w
	 info[18]=0x72;   //r
	 info[19]=0x69;   //i
	 info[20]=0x74;   //t
	 info[21]=0x65;   //e
	 //info[22]=0xb7;
	 info[22]=0x36; 
	 info[23]=0x44;   //D
	 info[24]=0x37;   //7
	 info[25]=0x2c;   //, 
	 info[26]=0x4c;   //L
	 info[27]=0x4f;   //O
	 info[28]=0x57;  //W
     return info;
};


exports.ping= function(messid1,messid2,sock){
	var info = new Buffer(2);
	info[0]=0x00;
	info[1]=0x04;
	sock.write(info);
	var info = new Buffer(4);
	info[0]=0x60;
	info[1]=0x00;
	messid1.copy(info,2);
	messid2.copy(info,3);
	sock.write(info);
	/* var info = new Buffer(2); 
	 info[0]=0x00;
	 info[1]=0x04;
	 console.log("info1:");
	 console.log(info);
	 sock.write(info);
	 var info = new Buffer(4);
	 info[0]=0x40;
	 info[1]=0x00;
	 //messid1.copy(info,4);
	 //messid2.copy(info,5);
	 info[2]=0x00;
	 info[3]=0x01;
	 console.log("info2:");
	 console.log(info)*/
};



