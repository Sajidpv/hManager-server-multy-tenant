import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"
import getSupplierModel from "./supplier.model.js";import getStockItemsModel from "./stock_items.model.js";

import getOrderModel from "./order_model.js";
import getGodownModel from "./godown.model.js";
import getStockCategoryModel from "./stock_categories.model.js";

const purchaseSchema = new Schema({


    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        required: true
    },
    supplier:
    {
        type: Schema.Types.ObjectId,
        ref: getSupplierModel,
        required:true
    },
    orderNo:
    {
        type:String,
        default:''

    },
    purID: {
        type: String,
        unique: true
    },
    invoice: {
        type: String,
    },
    discountType: {
        type: String,
        required: true
    },
    godownId: {
        type: Schema.Types.ObjectId,
        ref:getGodownModel,
        required: true
    },
    igst: {
        type: Number,
    },
    sgst: {
        type: Number,
    },
    cgst: {
        type: Number,
    },
    cess: {
        type: Number,
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
            remark: {
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
    billDiscount: {
        type: Number,
        required: true,
    }, 
       grossAmount: {
        type: Number,
        required: true,
    },
    netAmount: {
        type: Number,
        required: true,
    }},{timestamps:true}); 



 
 const getPurchaseModel=async (companyId)=>{
    const companyDb=await getCompanyDb(companyId);
    return companyDb.model('purchases', purchaseSchema);
 }
 
 export default getPurchaseModel
