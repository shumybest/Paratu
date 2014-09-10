function AirconditionModel(){
    //inherit DB
    var dbConnect = require("../public/DB");
    dbConnect.call(this);
    
    this.mode ="";
    this.temp ="";
    this.windlevel="";

    this.getAirconditionModel = function(){
        try{
            if(this.mongoose.model('Sc_aircondition')){
                return this.mongoose.model('Sc_aircondition');
            }
        }catch(e){
            if(e.name === 'MissingSchemaError'){
                var Sc_airconditionSchema= new this.mongoose.Schema({
	                _id : Number,
	                mode : String,
	                temp : Number,
	                windlevel : String
                }) ;

              //  this.construct();

                return this.mongoose.model('Sc_aircondition',Sc_airconditionSchema);
            }
        }
    }
}

module.exports = AirconditionModel;
