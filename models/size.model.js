import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"

const sizeSchema=new Schema({

     size: {
        type:String,
        required:true,
     }},{timestamps:true}); 
 



const getSizeModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('sizes',sizeSchema);
}

export default getSizeModel
