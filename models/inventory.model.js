import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"
import getStockCategoryModel from "./stock_categories.model.js";import getStockItemsModel from "./stock_items.model.js";


const inventorySchema = new Schema({


    date: {
        type: Date,
        default: Date.now,
    },
    inventoryId: {
        type: String,
        unique: true
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: getStockCategoryModel,
        require: true,
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String, 
        required: true,
    },
    orderNo: {
        type: String,
    },
    quantity: {
        type: Number, 
        required: true,
    },
    amount: {
        type: Number, 
        required: true,
    },
    transactionType: {
        type: String,
        required: true,
    }},{timestamps:true}); 


inventorySchema.pre('save', async function (next) {

    this.updatedOn = new Date();
    this.createdOn = new Date();
 
    next();
 
 });
 
 inventorySchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {
 
    const update = this.getUpdate();
    delete update._id;
    this.updatedOn = new Date();
 
    next();
 });
 
 const getInventoryModel=async (companyId)=>{
    const companyDb=await getCompanyDb(companyId);
    return companyDb.model('inventory-db', inventorySchema);
 }
 
 export default getInventoryModel
