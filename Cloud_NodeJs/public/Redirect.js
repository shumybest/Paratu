function Redirect(){
	this.response = function(url,info,res){
    	if(!url){
    		res.write(info+"\n");
    	}else{
    		res.redirect(url);
    	}
    }
}
module.exports = new Redirect();


