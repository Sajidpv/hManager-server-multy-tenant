import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js";
import getCutterAssignModel from "./cutter.assign.model.js";
import getUserModel from "./user.model.js";
import getStockItemsModel from "./stock_items.model.js";
import getStockModel from "./stock.model.js";


const cutterFinishSchema = new Schema({
   date: {
      type: Date,
      require: true
   },
   proAssignID: {
      type: Schema.Types.ObjectId,
      ref: getCutterAssignModel,
      require: true
   },
   productId: {
      type: Schema.Types.ObjectId,
      ref: getStockItemsModel,
      require: true
   },
   materialId: {
      type: Schema.Types.ObjectId,
      ref: getStockModel,
      require: true
   },
   employId: {
      type: Schema.Types.ObjectId,
      ref: getUserModel,
      require: true
   },
   batchId: {
      type: String,
      require: true,
   },
   items: [{
      layerCount: {
         type: Number,
         require: true
      },
      meterLayer: {
         type: Number,
         require: true
      },
      pieceLayer: {
         type: Number,
         require: true
      },
      color: {
         type: String,
         require: true,

      },
      sizes:[ {
         size: {
            type: String,
            required: true,
         },
         quantity: {
            type: Number,
            required: true,
         },
         status: {
            type: String,
            default: 'Pending',
            require: true
   
         }
      }],
     
      balance: {
         type: Number,
         require: true
      },
      damage: {
         type: Number,
         require: true
      },
      wastage: {
         type: Number,
         require: true
      },
   
   }]},{timestamps:true}); 


cutterFinishSchema.pre('save', async function (next) {

   this.updatedOn = new Date();
   this.createdOn = new Date();

   next();

});

cutterFinishSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {

   const update = this.getUpdate();
   delete update._id;
   this.updatedOn = new Date();

   next();
});



const getCutterFinishModel=async (companyId)=>{
   const companyDb=await getCompanyDb(companyId);
   return companyDb.model('finish-cutter', cutterFinishSchema);
}

export default getCutterFinishModel