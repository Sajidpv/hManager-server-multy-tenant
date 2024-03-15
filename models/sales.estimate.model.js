import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js";
import getStockCategoryModel from "./stock_categories.model.js";
import getStockItemsModel from "./stock_items.model.js";
import getSupplierModel from "./supplier.model.js";

const salesEstimateSchema = new Schema({


    date: {
        type: Date,
        default: Date.now,
    },
   estimateNo: {
        type: String,
        required: true
    },
    customerId:
    {
        type: Schema.Types.ObjectId,
        ref: getSupplierModel,
        required:true
    },
    items: [
        {

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
            color: {
                type: String,

            },
            size: {
                type: String,

            },
            discription: {
                type: String,

            },
            quantity: {
                type: Number,
                required: true,
            },
            rate: {
                type: Number,
                required: true,
            },
            discount: {
                type: Number,
 
            },
            amount: {
                type: Number,
                required: true,
            },
            igst: {
                type: Number,
            },
            sgst: {
                type: Number,
            },
            cgst: {
                type: Number,
            }
        },
    ],
    grossAmount: {
        type: Number,
        required: true,
    }, 
       roundOff: {
        type: Number,
    },
    cess: {
        type: Number,
    },
    isTaxInclude: {
        type: Boolean,
        required: true,
    },
    netAmount: {
        type: Number,
        required: true,
    }},{timestamps:true}); 

salesEstimateSchema.pre('save', async function (next) {

    this.updatedOn = new Date();
    this.createdOn = new Date();
 
    next();
 
 });
 
 salesEstimateSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {
 
    const update = this.getUpdate();
    delete update._id;
    this.updatedOn = new Date();
 
    next();
 });
 
 const getsalesEstimateModel=async (companyId)=>{
    const companyDb=await getCompanyDb(companyId);
    return companyDb.model('sales-estimates', salesEstimateSchema);
 }
 
 export default getsalesEstimateModel
