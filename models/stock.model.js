import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"
import getGodownModel from "./godown.model.js";
import getStockCategoryModel from "./stock_categories.model.js";
import getStockItemsModel from "./stock_items.model.js";

const stockSchema = new Schema({
   categoryId: {
      type: Schema.Types.ObjectId,
      ref: getStockCategoryModel,
      required: true,
   },
   itemId: {
      type: Schema.Types.ObjectId,
      ref:getStockItemsModel,
      required: true,
   },
   itemCode: {
      type: String,
   },
   godowns: [{
      godownId: {
         type: Schema.Types.ObjectId,
         ref: getGodownModel,
         required: true,
      },
      colors: [{
         color: {
            type: String,
            required: true,
         },
         sizes: [{
            size: {
               type: String,
               required: true,
            },
            quantity: {
               type: Number,
               required: true,
            }
         }],
      }],
   }]},{timestamps:true}); 


stockSchema.pre('save', async function (next) {

   this.updatedOn = new Date();
   this.createdOn = new Date();

   next();

});

stockSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {

   const update = this.getUpdate();
   delete update._id;
   this.updatedOn = new Date();

   next();
});

const getStockModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('stock', stockSchema);
}

export default getStockModel
