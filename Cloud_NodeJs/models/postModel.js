function PostModel(){
    //inherit DB
    var dbConnect = require("../public/DB");
    dbConnect.call(this);
    
    this.tool = require('../public/Tool');
}

PostModel.prototype.getPostModel = function(){
	try{
        if(this.mongoose.model('Sc_post')){
            return this.mongoose.model('Sc_post');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
        	var Comments = new this.mongoose.Schema({
                name : String,
                time : String,
                content : String
            });

            var Sc_postSchema= new this.mongoose.Schema({
                name : String ,
                time : String, //new Date();
                title : String, 
                content : String,
                picture : String,
                comments : [Comments],
                pv : {type:Number,default:0}
            }) ;
            
            Sc_postSchema.statics.addComment = function(query,update,callback){
            	this.collection.findAndModify(query,[],update,{new: true},function(err, result){
            		return callback(err,result);
            	});  
            }
            
            return this.mongoose.model('Sc_post',Sc_postSchema);
        }
    }
}

PostModel.prototype.doPostPresent = function(modelDB,request,callback){
	var pattern = new RegExp("^.*" + request.titlename + ".*$", "i");
	if(!request.action){  //req.body.action
		var search = {};
	}else{
		var search = {"title": pattern};
	}
	
	var searchModel = {
			search:search,
			columns:{}//columns:{_id:0},
	};
	
	this.tool.findPagination(searchModel,modelDB,'time',function(err, pageCount,pageinfo, lists){
		pageinfo['pageCount']=pageCount;
		pageinfo['size']=lists.length;
		pageinfo['numberOf']=pageCount>10?10:pageCount;
		
		/* markdown 用法
			### <<书名>> ### 
			** **  加粗
			-海贼王    点
			>    对应于<p>
			[liu](http://localhost/view/pp.html)   超链接
		*/
		var markdown = require('markdown').markdown;
		lists.forEach(function (list) {
			list.content = markdown.toHTML(list.content);
		});
		
		callback({lists:lists,page:pageinfo});
	});
};


PostModel.prototype.doGetOnePost = function(modelDB,request,callback){
	//var query_doc = {name:req.params.user,title:decodeURI(req.params.title)};
	var query_doc = {_id:request.id};  //req.params
	var option = {_id:0};
	
	var postModel = this;
	this.find(modelDB,query_doc,option,function(err,result){
		if(result){
			var markdown = require('markdown').markdown;
			result.content = markdown.toHTML(result.content);
			result.comments.forEach(function (comment) {
				comment.content = markdown.toHTML(comment.content);
			});
			
			var updateContent = {$inc:{"pv":1}};

			postModel.update(modelDB,query_doc,updateContent,function(err,response){
				if(response){
					callback(result);
		    	}
			});
		}
	});
};


PostModel.prototype.doAddComment = function(modelDB,request,username,callback){
	var time = this.tool.timeAchieve().time;
	var update_doc = {title:request.title};   //req.body

	var updateContent = {$push:{comments:{name:username,time:time,content:request.content}}};

	modelDB.addComment(update_doc,updateContent,function(err,result){
		callback(result);
	});
};

PostModel.prototype.doSavePost = function(modelDB,request,username,callback){
	var tool = this.tool;
	var postModel = this;
	var fs = require('fs');
	var formidable = require("formidable"); 
	var form = new formidable.IncomingForm();
	form.keepExtensions =  true;
	form.uploadDir = './public/images';

	form.parse(request,function(err, fields, files){   //request == req
		var picture = files.upload.name;
		fs.renameSync(files.upload.path,"./public/images/"+picture);   
		//var util=require('util');
		//console.log('in if condition'+util.inspect({fields: fields, files: files}));
		var time = tool.timeAchieve().time;
		var insert_doc = {name:username,time:time,title:fields.title,content:fields.content,picture:picture};
		postModel.insert(modelDB,insert_doc,function(err,result){
	    		callback();
	    });
	}); 
};

module.exports = new PostModel();
