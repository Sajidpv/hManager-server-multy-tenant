
import getAssignCutterModel from "../models/cutter.assign.model.js";
import getCounterModel from "../models/counter.model.js";
import getStockCategoryModel from "../models/stock_categories.model.js";
import getStockModel from "../models/stock.model.js";
import getUserModel from "../models/user.model.js";
import getGodownModel from "../models/godown.model.js";
import getStockItemsModel from "../models/stock_items.model.js";

export async function registerCutterAssign(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let assignCutterModel = await getAssignCutterModel(companyId);
    let counterModel = await getCounterModel(companyId);

    const { date, productId, stockID, employID, assignedQuantity } = req.body;

    let counter = await counterModel.findOne({ id: "batchId" });

    let seqId;
    if (!counter) {
      const newCounter = new counterModel({ id: "batchId", seq: 1 });
      await newCounter.save();
      seqId = "BATCH" + newCounter.seq.toString().padStart(2, "0");
    } else {
      counter.seq += 1;
      await counter.save();
      seqId = "BATCH" + counter.seq.toString().padStart(2, "0");
    }

    const addToAssign = new assignCutterModel({ date: date, batchID: seqId, productId: productId, stockID: stockID, employID: employID, assignedQuantity: assignedQuantity });
    await addToAssign.save();
    next();
    // res.json({ status: true,data:addToAssign, message: "Assigned Succefully" });
  } catch (error) {
    res.json({ status: false, message: error });
  }
}



export async function getAssignCutter(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let assignCutterModel = await getAssignCutterModel(companyId);
    let stockCategoryModel = await getStockCategoryModel(companyId);
    let stockModel = await getStockModel(companyId);
    let userModel = await getUserModel(companyId);
    let godownModel = await getGodownModel(companyId);

    let data = await assignCutterModel.find()
      .populate({ path: 'productId', model: await getStockItemsModel(companyId) })
      .populate({
        path: 'stockID', model: stockModel,
        populate: {
          path: 'categoryId', model: stockCategoryModel
        },
        populate: {
          path: 'itemId', model: await getStockItemsModel(companyId)
        },
      })
      .populate({ path: 'employID', model: userModel })
      .populate({ path: 'assignedQuantity.godownId', model: godownModel });
    res.json({ message: 'Assignments Loaded', status: true, data: data });
  } catch (error) {
    console.log(error)
    res.json({ message: error.message, status: false });
  }
};



export async function updateStatusCutterAssign(req, res, next) {

  try {
    let companyId = req.user.companyId;
    let assignCutterModel = await getAssignCutterModel(companyId);

    const { colorId, status: newStatus } = req.body;
    const itemId = req.params.id;

    const item = await assignCutterModel.findById(itemId);

    if (item) {
      let colorItem = item.assignedQuantity.find((q) => q._id.toString() === colorId);

      if (!colorItem) {
        colorItem = item.assignedQuantity.find((q) => q.color.toString() === colorId);
      }
      if (colorItem) {

        colorItem.status = newStatus;


        await item.save();

        res.json({ status: true, data: item, message: "Status updated" });
      } else {
        res.status(404).json({ status: false, message: "Color item not found" });
      }
    } else {
      res.status(404).json({ status: false, message: "No item found" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error });
  }

};
