import  {Schema,mongoose } from "mongoose";
import {getCompanyDb} from "../config/db.js"

const godownSchema = new Schema({
    godownId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required:true
    },
     location: {
        type: String,
        required: true,
     },
    capacity: {
        type: Number,
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
},{timestamps:true});



 

 const getGodownModel=async (companyId)=>{
    const companyDb=await getCompanyDb(companyId);
    return companyDb.model('godowns',godownSchema);
 }


 export default getGodownModel
