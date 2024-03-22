import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"

const suppSchema = new Schema({

   name: {
      type: String,
      required: true,
   },
   gstNo: {
      type: String,
   },
   address: {
      addressLine1: {
         type: String,
         required: true,
      }, addressLine2: {
         type: String,
       
      }, country: {
         type: String,
         required: true,
      }, state: {
         type: String,
         required: true,
      }, zip: {
         type: Number,
         required: true,
      }, mobile: {
         type: String,
      
      }, email: {
         type: String,
      },
   },
   status: {
      type: String,
      required: true,
   },
   accDetails:{
      bank: {
         type: String,
    
      },
      ifsc: {
         type: String,

      },
      accNo: {
         type: Number,

      },
      panNo: {
         type: String,
  
      },
   },
   type:{
      type:String,
      required:true
   }},{timestamps:true}); 



const getSupplierModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('suppliers', suppSchema);
}

export default getSupplierModel
