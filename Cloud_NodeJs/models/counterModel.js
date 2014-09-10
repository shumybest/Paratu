function CounterModel(){
    //inherit DB
    var dbConnect = require("../public/DB");
    dbConnect.call(this);
    
    this.modelDB = this.getCounterModel();
}

CounterModel.prototype.getCounterModel = function(){
	try{
        if(this.mongoose.model('Sc_counter')){
            return this.mongoose.model('Sc_counter');
        }
    }catch(e){
        if(e.name === 'MissingSchemaError'){
            var Sc_counterSchema= new this.mongoose.Schema({
            	_id : {
                	type : String,  
                	require : true,
                	index : {unique : true }
                },
                counter : {
                	type : Number, 
                	require : true
                }
            }) ;

         /*  Sc_counterSchema.statics.incrementCounter = function(module,callback){
            	this.collection.findAndModify({_id:module},[],{$inc: {counter: 1}},{new: true, upsert: true},function(err, result){
            		return callback(err,result.counter);
            	});  
            }*/

            return this.mongoose.model('Sc_counter',Sc_counterSchema);
        }
    }
};

CounterModel.prototype.incrementCounter = function(module,callback){
	var self = this;
	self.findAndModify(self.modelDB,{_id:module},{$inc: {counter: 1}},function(err,result){
		return callback(result.counter);
	});
};

module.exports = new CounterModel();
