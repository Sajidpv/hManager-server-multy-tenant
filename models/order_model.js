import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"
import getStockCategoryModel from "./stock_categories.model.js";
import getStockItemsModel from "./stock_items.model.js";

const orderSchema = new Schema({

    date: {
        type: Date,
        required: true,
    },
    orderNo: {
        type: String,
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: getStockCategoryModel,
        require: true,
     },
     itemId: {
        type: Schema.Types.ObjectId,
        ref:getStockItemsModel,
        required: true,
     },
    orderType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending'
    }, items: [{
        color: {
            type: String,

        }, quantity: {
            type: Number,
            required: true,
        }, remark: {
            type: String,

        }
    },]},{timestamps:true}); 


orderSchema.pre('save', async function (next) {

    this.updatedOn = new Date();
    this.createdOn = new Date();
 
    next();
 
 });
 
 orderSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {
 
    const update = this.getUpdate();
    delete update._id;
    this.updatedOn = new Date();
 
    next();
 });
 
 const getOrderModel=async (companyId)=>{
    const companyDb=await getCompanyDb(companyId);
    return companyDb.model('orders', orderSchema);
 }
 
 export default getOrderModel
