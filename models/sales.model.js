import  {Schema } from "mongoose";
import {getCompanyDb} from "../config/db.js"
import getSupplierModel from "./supplier.model.js";
import getStockCategoryModel from "./stock_categories.model.js";
import getGodownModel from "./godown.model.js";
import getStockItemsModel from "./stock_items.model.js";

const salesSchema = new Schema({


    date: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
    },
    invoiceNo: {
        type: String,
        required: true
    },
    purchaseOrderNo: {
        type: String,
    },
    customerId:
    {
        type: Schema.Types.ObjectId,
        ref: getSupplierModel,
        required:true
    },
    godownId: {
        type: Schema.Types.ObjectId,
        ref:getGodownModel,
        required: true
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
       discount: {
        type: Number,
        required: true,
    },
    otherCharges: {
        type: Number,
    },
   
    isTaxInclude: {
        type: Boolean,
        required: true,
    }, cess: {
        type: Number,
    },
    netAmount: {
        type: Number,
        required: true,
    }},{timestamps:true}); 



 
 const getSalesModel=async (companyId)=>{
    const companyDb=await getCompanyDb(companyId);
    return companyDb.model('sales', salesSchema);
 }
 
 export default getSalesModel
