import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"
import getStockItemsModel from "./stock_items.model.js";

const finisherSchema = new Schema({
    date: {
        type: Date,
        default: Date.now,
        require: true
    },
    batchId: {
        type: String,
        require: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref:getStockItemsModel,
        require: true
    },
    stockId: {
        type: Schema.Types.ObjectId,
        ref: 'stock',
        require: true
    },
    employId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    }, 
      tailerFinishId:{
        type: Schema.Types.ObjectId,
        ref: 'tailer-docs',
        require: true
    },
    color: {
        type: String,
        require: true
    }, size: {
        type: String,
        require: true
    },
    assignedQuantity: {
        type: Number,
        require: true
    },
    balanceQuantity: {
        type: Number,
        require: true
    },
    damageQuantity: {
        type: Number,
        require: true
    },
    finishedQuantity: {
        type: Number,
        require: true
    },
 
    status: {
        type: String,
        default:'Processing',
        require:true
      
    }},{timestamps:true}); 
 

 const getFinisherModel=async (companyId)=>{
    const companyDb=await getCompanyDb(companyId);
    return companyDb.model('finisher-docs', finisherSchema);
 }
 
 export default getFinisherModel
