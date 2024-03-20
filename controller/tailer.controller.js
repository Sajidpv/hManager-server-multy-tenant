
import getCutterFinishModel from "../models/cutter.finish.model.js";
import getStockModel from "../models/stock.model.js";
import getStockItemsModel from "../models/stock_items.model.js";
import getTailerModel from "../models/tailer.model.js";
import getUserModel from "../models/user.model.js";

export async function assignTailer(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let tailerModel = await getTailerModel(companyId);
        const { date, batchId, productId, stockId, employId, color, size, assignedQuantity, cutterFinishId } = req.body;

        const addToAssign = new tailerModel({ date: date, batchId: batchId, productId: productId, stockId: stockId, cutterFinishId: cutterFinishId, employId: employId, color: color, size: size, assignedQuantity: assignedQuantity, finishedQuantity: 0, balanceQuantity: assignedQuantity, damageQuantity: 0 });
        await addToAssign.save();
        next();
    } catch (error) {
        res.json({ status: false, message: error });
    }
}

export async function getAssignTailer(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let tailerModel = await getTailerModel(companyId);
        const result = await tailerModel.find().populate({ path: 'productId', model: await getStockItemsModel(companyId) })
            .populate({ path: 'stockId', model: await getStockModel(companyId), populate: { path: 'itemId', model: await getStockItemsModel(companyId) } })
            .populate({ path: 'employId', model: await getUserModel(companyId) })
            .populate({ path: 'cutterFinishId', model: await getCutterFinishModel(companyId) })

        res.json({ status: true, message: 'loaded', data: result });
    } catch (error) {

        res.json({ status: false, message: error });
    }
}

export async function updateTailerDatas(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let tailerModel = await getTailerModel(companyId);
        const { balanceQuantity, finishedQuantity, damageQuantity } = req.body;
        const itemId = req.params.id;

        const updateObj = {
            $set: {
                balanceQuantity: balanceQuantity
            },
            $inc: {
                finishedQuantity: finishedQuantity, 
                damageQuantity: damageQuantity     
            }
        };
        if (balanceQuantity == 0) {
                updateObj.$set.status ='To be assigned' ;
        }

        const result = await tailerModel.updateOne(
            { _id: itemId },
            updateObj,
            { new: true }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ status: false, message: "Item not found" });
        }

        const updatedItem = await tailerModel.findById(itemId);
        res.json({ status: true, data: updatedItem, message: "Finished successfull" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, message: error.message });
    }
}

