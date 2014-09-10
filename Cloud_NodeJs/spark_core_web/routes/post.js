/*
Function: Blogs
* */
var postModel = require("../../models/postModel");;
var postModelDB = postModel.getPostModel();

exports.publish=function(req,res){
    res.render('post/publish');
}

exports.savePost=function(req,res){
	var username = req.session.user.name;
	postModel.doSavePost(postModelDB,req,username,function(){
		return res.redirect('/post');
	});
}

exports.post = function(req,res){
	postModel.doPostPresent(postModelDB,req.body,function(result){
		if(req.query.p){
			result.page['num'] = req.query.p<1?1:req.query.p;
		}

		return res.render('post/present', {
			lists:result.lists,
			page:result.page
		});
	});
}

exports.getOnePost = function(req,res){
	postModel.doGetOnePost(postModelDB,req.params,function(result){
		return res.render('post/article', {
			post:result
		});
	});
}

exports.addComment = function(req,res){
	var username = req.session.user.name;
	postModel.doAddComment(postModelDB,req.body,username,function(result){
		return res.render('post/article', {
			post:result
		});
	});
}


exports.edit = function(req,res){
	//先通过params传过来的值找到这个文档然后显示出来
	/*标题：<br />
	<input type="text" name="title" value="<%= post.title %>" disabled="disabled" /><br />
	*/
}


exports.doEdit = function(req,res){
	/*var update_doc = {name:req.params.user,title:decodeURI(req.params.title)};
	var updateContent = {$set:obj.instance};

	model.update(modelDB,update_doc,updateContent,function(err,res){
		if(!res){
    		sock.write("{res:'update device error'}\n")
    	}else{
    		sock.write("{res:'update device success'}\n")
    	}
	});*/
}



