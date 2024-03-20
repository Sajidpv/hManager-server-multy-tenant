import { Schema } from "mongoose";
import { getCompanyDb } from "../config/db.js"
import getStockModel from "./stock.model.js";
import getUserModel from "./user.model.js";
import getStockItemsModel from "./stock_items.model.js";
import getCutterFinishModel from "./cutter.finish.model.js";

const tailerAssgnSchema = new Schema({
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
        ref: getStockItemsModel,
        require: true
    },
    stockId: {
        type: Schema.Types.ObjectId,
        ref: getStockModel,
        require: true
    },
    employId: {
        type: Schema.Types.ObjectId,
        ref: getUserModel,
        require: true
    },
    cutterFinishId: {
        type: Schema.Types.ObjectId,
        ref: getCutterFinishModel,
        require: true
    },
    color: {
        type: String,
        require: true
    },
    size: {
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

    },  
      finishedQuantity: {
        type: Number,

    },
    status: {
        type: String,
        default: 'Pending',
        require: true

    }
}, { timestamps: true });


tailerAssgnSchema.pre('save', async function (next) {
    this.updatedOn = new Date();
    this.createdOn = new Date();
    next();
});
tailerAssgnSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function (next) {
    const update = this.getUpdate();
    delete update._id;
    this.updatedOn = new Date();

    next();
});
const getTailerAssignModel = async (companyId) => {
    const companyDb = await getCompanyDb(companyId);
    return companyDb.model('assign-tailer', tailerAssgnSchema);
}

export default getTailerAssignModel

