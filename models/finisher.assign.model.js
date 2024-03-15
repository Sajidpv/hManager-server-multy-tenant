import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"
import getStockItemsModel from "./stock_items.model.js";

const finisherAssgnSchema = new Schema({
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
    materialId: {
        type: Schema.Types.ObjectId,
        ref: 'stock',
        require: true
    },
    employId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
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
    tailerFinishId:{
        type: Schema.Types.ObjectId,
        ref: 'finish-tailer',
        require: true
    },
    status: {
        type: String,
        default:'Pending',
        require:true
      
    }},{timestamps:true}); 


finisherAssgnSchema.pre('save', async function (next) {

    this.updatedOn = new Date();
    this.createdOn = new Date();
 
    next();
 
 });
 
 finisherAssgnSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {
 
    const update = this.getUpdate();
    delete update._id;
    this.updatedOn = new Date();
 
    next();
 });
 
 

 const getFinisherAssignModel=async (companyId)=>{
    const companyDb=await getCompanyDb(companyId);
    return companyDb.model('assign-finisher', finisherAssgnSchema);
 }
 
 export default getFinisherAssignModel
