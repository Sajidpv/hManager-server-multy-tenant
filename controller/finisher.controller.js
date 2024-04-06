
import getFinisherModel from "../models/finisher.model.js";
import getStockItemsModel from "../models/stock_items.model.js";
import getUserModel from "../models/user.model.js";
import getStockModel from "../models/stock.model.js";
import getTailerModel from "../models/tailer.model.js";

export async function assignFinisher(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let finisherAssignModel = await getFinisherModel(companyId);
        const { date, batchId, productId, stockId, employId, color, size, assignedQuantity, tailerFinishId } = req.body;

        const addToAssign = new finisherAssignModel({ date: date, batchId: batchId, productId: productId, stockId: stockId, employId: employId, color: color, size: size, assignedQuantity: assignedQuantity, damageQuantity: 0, finishedQuantity: 0, balanceQuantity: assignedQuantity,toStockQuantity:0, tailerFinishId: tailerFinishId });
        await addToAssign.save();
        next();
    } catch (error) {
        res.json({ status: false, message: error });
    }
}

export async function getAssignFinisher(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let finisherAssignModel = await getFinisherModel(companyId);
        const result = await finisherAssignModel.find()
            .populate({ path: 'productId', model: await getStockItemsModel(companyId) })
            .populate({
                path: 'stockId', model: await getStockModel(companyId), populate: {
                    path: 'itemId', model: await getStockItemsModel(companyId)
                },
            })
            .populate({ path: 'employId', model: await getUserModel(companyId) })
            .populate({ path: 'tailerFinishId', model: await getTailerModel(companyId) });

        res.json({ status: true, data: result, message: 'loaded' });
    } catch (error) {
        res.json({ status: false, message: error });
    }
}

export async function updateFinisherDatas(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let finisherModel = await getFinisherModel(companyId);
        const { balanceQuantity, finishedQuantity, damageQuantity } = req.body;
        const itemId = req.params.id;

        const updateObj = {
            $set: {
                balanceQuantity: balanceQuantity
            },
            $inc: {
                finishedQuantity: finishedQuantity,
                toStockQuantity:finishedQuantity,
                damageQuantity: damageQuantity
            }
        };
        if (balanceQuantity == 0) {
            updateObj.$set.status = 'To stock';
        }

        const result = await finisherModel.updateOne(
            { _id: itemId },
            updateObj,
            { new: true }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ status: false, message: "Item not found" });
        }

      
            const updatedItem = await finisherModel.findById(itemId);
            res.json({ status: true, data: updatedItem, message: "Finished successfull" });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, message: error.message });
    }
}

export async function updateFinisherStatus(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let finisherModel = await getFinisherModel(companyId);
        const itemId = req.params.id;
        const { godowns } = req.body;

        const result = await finisherModel.updateOne(
            { _id: itemId },
            [
                {
                    $set: {
                        toStockQuantity: { $subtract: ["$toStockQuantity", godowns[0].colors[0].sizes[0].quantity] }
                    }
                },
                {
                    $set: {
                        status: {
                            $cond: {
                                if: { $eq: ["$balanceQuantity", 0] },
                                then: "Finished",
                                else: "$status" 
                            }
                        }
                    }
                }
            ],
            { new: true }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ status: false, message: "Item not found" });
        }
            const updatedItem = await finisherModel.findById(itemId);
            res.json({ status: true, data: updatedItem, message: "Finished successfull" });
        
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}



