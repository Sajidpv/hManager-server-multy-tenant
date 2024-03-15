import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"


const colorSchema=new Schema({

     color: {
        type:String,
        required:true,
     } 
   },{timestamps:true});
 

colorSchema.pre('save', async function (next) {

   this.updatedOn = new Date();
   this.createdOn = new Date();

   next();

});

colorSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {

   const update = this.getUpdate();
   delete update._id;
   this.updatedOn = new Date();

   next();
});
const getColorModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('colors',colorSchema)
}

export default getColorModel

