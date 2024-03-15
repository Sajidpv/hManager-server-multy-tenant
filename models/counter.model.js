import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"

const couterSchema = new Schema({
   id: {
      type: String,

   },
   seq: {
      type: Number,
   }
},{timestamps:true}); 


couterSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {

   const update = this.getUpdate();
   delete update._id;
   next();
});


const getCounterModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('counter', couterSchema)
}

export default getCounterModel
