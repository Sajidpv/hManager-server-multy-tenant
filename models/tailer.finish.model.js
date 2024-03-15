import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"
import getStockItemsModel from "./stock_items.model.js"
 
const tailerFinishSchema = new Schema({
    date: {
        type: Date,
        default: Date.now,
        require: true
    },
    tailerAssignID: {
        type: Schema.Types.ObjectId,
        ref: 'assign-tailer',
        require: true
    },
    batchId: {
        type: String,
        require: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: getStockItemsModel,
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
    color: {
        type: String,
        require: true
    }, size: {
        type: String,
        require: true
    },
    finishedQuantity: {
        type: Number,
        require: true
    },  damage: {
        type: Number,
        require: true
    },
   
    status: {
        type: String,
        default:'Pending',
        require:true
      
    }},{timestamps:true}); 

tailerFinishSchema.pre('save', async function (next) {
    this.updatedOn = new Date();
    this.createdOn = new Date();
    next();
 });
 tailerFinishSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {
    const update = this.getUpdate();
    delete update._id;
    this.updatedOn = new Date();
 
    next();
 });

 const getTailerFinishModel=async (companyId)=>{
    const companyDb=await getCompanyDb(companyId);
    return companyDb.model('finish-tailer', tailerFinishSchema);
 }
 
 export default getTailerFinishModel