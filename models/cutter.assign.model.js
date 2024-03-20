import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"
import getStockModel from "./stock.model.js";
import getUserModel from "./user.model.js";
import getGodownModel from "./godown.model.js";
import getStockItemsModel from "./stock_items.model.js";

const cutterAssgnSchema = new Schema({
   date: {
      type: Date,
      default: Date.now,
      required: true
   },
   batchID: {
      type: String,
      unique: [true, 'Batch ID must be unique']
   },
   productId: {
      type: Schema.Types.ObjectId,
      ref: getStockItemsModel, 
      required: true
   },
   stockID: {
      type: Schema.Types.ObjectId,
      ref: getStockModel,
      required: true
   },
   employID: {
      type: Schema.Types.ObjectId,
      ref: getUserModel,
      required: true
   },
   assignedQuantity: [
      {
         godownId: {
            type: Schema.Types.ObjectId,
            ref: getGodownModel,
            required: true
        },
         color: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: 'Processing',
            required: true
      }
      }
   ]},{timestamps:true}); 

cutterAssgnSchema.pre('save', function (next) {
   this.updatedOn = this.createdOn = new Date();
   next();
});

cutterAssgnSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {
   const update = this.getUpdate();
   delete update._id;
   this.updatedOn = new Date();
   next();
});

const getCutterAssignModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('assign-cutter', cutterAssgnSchema);
}

export default getCutterAssignModel