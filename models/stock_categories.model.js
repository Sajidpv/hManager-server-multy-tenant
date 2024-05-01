import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"

const categorySchema = new Schema({

   categoryName: {
      type: String,
      require: true,
   },
   discription: {
      type: String,
      require: true,
   },
   categoryNumber: {
      type: String,
   },
   isColorApplicable: {
      type: Boolean,
      require: true,
   },
   isSizeApplicable: {
      type: Boolean,
      require: true,
   }, isProductionItem: {
      type: Boolean,
      require: true,
   },
   isProductionAddon: {
      type: Boolean,
      require: true,
   },
   isProduct: {
      type: Boolean,
      require: true,
   }},{timestamps:true}); 




const getStockCategoryModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('stock-categories', categorySchema);
}

export default getStockCategoryModel
