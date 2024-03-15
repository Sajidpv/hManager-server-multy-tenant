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
   isProduct: {
      type: Boolean,
      require: true,
   }},{timestamps:true}); 


categorySchema.pre('save', async function (next) {

   this.updatedOn = new Date();
   this.createdOn = new Date();

   next();

});

categorySchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {

   const update = this.getUpdate();
   delete update._id;
   this.updatedOn = new Date();

   next();
});

const getStockCategoryModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('stock-categories', categorySchema);
}

export default getStockCategoryModel
