import { Schema } from "mongoose";
import { getCompanyDb } from "../config/db.js";
import getStockCategoriesModel from "./stock_categories.model.js";

const categoryItemSchema = new Schema({


   categoryId: {
      type: Schema.Types.ObjectId,
      ref: getStockCategoriesModel,
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
   price: {
      type: Number,
      required: true,
   },
   mrp: {
      type: Number,

   },
   description: {
      type: String,
      required: true,
   },
   hsn: {
      type: String,
   },
   igst: {
      type: Number,
      required: true,
   },
   cess: {
      type: Number,
      required: true,
   },
   cutCostPiece: {
      type: Number,
   }, stichCostPiece: {
      type: Number,
   }, ironCostPiece: {
      type: Number,
   }, threadCostPiece: {
      type: Number,
   }, packCostPiece: {
      type: Number,
   }, washCostPiece: {
      type: Number,
   }, totalCostJob: {
      type: Number,
   }, cutCostJob: {
      type: Number,
   }, stichCostJob: {
      type: Number,
   }, finishCostJob: {
      type: Number,
   }, washCostJob: {
      type: Number,
   },
   blend: {
      type: String,
   },
   barCode: {
      type: String,
   },
   productCode: {
      type: String,
   },
   styleNo: {
      type: String,
   },
}, { timestamps: true });




const getStockItemsModel = async (companyId) => {
   const companyDb = await getCompanyDb(companyId);
   return companyDb.model('stock-category-items', categoryItemSchema);
}

export default getStockItemsModel
