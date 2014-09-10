function LightModel(){
    //inherit DB
    var dbConnect = require("../public/DB");
    dbConnect.call(this);
    
    this.value ="";

    this.getLightModel = function(){
        try{
            if(this.mongoose.model('Sc_light')){
                return this.mongoose.model('Sc_light');
            }
        }catch(e){
            if(e.name === 'MissingSchemaError'){
                var Sc_lightSchema= new this.mongoose.Schema({
	                _id : Number,
	                value : String,
	                owner : String
                }) ;

                //this.construct();

                return this.mongoose.model('Sc_light',Sc_lightSchema);
            }
        }
    }
}

module.exports = LightModel;
