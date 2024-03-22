import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"


const colorSchema=new Schema({

     color: {
        type:String,
        required:true,
     } 
   },{timestamps:true});
 

const getColorModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('colors',colorSchema)
}

export default getColorModel

