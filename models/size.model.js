import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"

const sizeSchema=new Schema({

     size: {
        type:String,
        required:true,
     }},{timestamps:true}); 
 

sizeSchema.pre('save', async function (next) {

   this.updatedOn = new Date();
   this.createdOn = new Date();

   next();

});

sizeSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {

   const update = this.getUpdate();
   delete update._id;
   this.updatedOn = new Date();

   next();
});

const getSizeModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('sizes',sizeSchema);
}

export default getSizeModel
