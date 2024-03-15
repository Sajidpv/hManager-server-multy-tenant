
import getStockModel from "../models/stock.model.js";
import getTailerFinishModel from "../models/tailer.finish.model.js";

export async function finishTailer(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let tailerFinishModel = await getTailerFinishModel(companyId);
    const { date, tailerAssignID, batchId, productId, stockId, employId, color,size, finishedQuantity, damage } = req.body;

    const addToAssign = new tailerFinishModel({ date: date, tailerAssignID: tailerAssignID, batchId: batchId, productId: productId, stockId: stockId, employId: employId, color: color,size:size, finishedQuantity: finishedQuantity, damage: damage });
    await addToAssign.save();
    res.status(200).json({ status: true, data: addToAssign, message: "Finished Succefully" });
  } catch (error) {
    res.json({ status: false, message: error });
  }
}

// export async function getFinishedTailer(req,res){
//   try {
//     let companyId = req.user.companyId;
//     let tailerFinishModel = await getTailerFinishModel(companyId);
//     const result = await tailerFinishModel.find();

//       res.json({ status: true,data:result, message:'loaded' });
//   } catch (error) {
//     res.json({ status: false, message:error });
//   }
// }


export async function getFinishedTailer(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let tailerFinishModel = await getTailerFinishModel(companyId);
    const result = await tailerFinishModel.aggregate([
      {
        $group: {
          _id: "$productId",
          batches: {
            $push: {
              finishId: "$_id",
              tailerAssignID: "$tailerAssignID",
              date: "$date",
              batchId: "$batchId",
              stockId: "$stockId",
              employId: "$employId",
              color: "$color",
              size:"$size",
              quantity: "$finishedQuantity",
              finishedQuantity: "$finishedQuantity"
            }
          }
        }
      },
      {
        $unwind: "$batches"
      },
      {
        $lookup: {
          from: 'assign-tailers',
          localField: "batches.tailerAssignID",
          foreignField: "_id",
          as: "Assignments"
        }
      }, {
        $lookup: {
          from: 'stock-category-items',
          localField: "_id",
          foreignField: "_id",
          as: "Product"
        }
      },
      {
        $lookup: {
          from: "stocks",
          localField: "batches.stockId",
          foreignField: "_id",
          as: "Stock"
        }
      },
      {
        $lookup: {
          from: "stock-category-items",
          localField: "Stock.itemId",
          foreignField: "_id",
          as: "Material"
        }
      }, {
        $lookup: {
          from: "users",
          localField: "batches.employId",
          foreignField: "_id",
          as: "Employ"
        }
      },
      {
        $group: {
          _id: "$_id",
          Product: { $first: "$Product" },
          batches: {
            $push: {
              finishId: "$batches.finishId",
              date: "$batches.date",
              batchId: "$batches.batchId",
              items: "$batches.color",
              size:"$batches.size",
              quantity: "$batches.quantity",
              assignId: { $first: "$Assignments" },
              stockId: { $first: "$Stock"},
              employ: { $first: "$Employ"},
              Material: { $first: "$Material" }
            }
          }
        }
      }, {
        $replaceRoot: {
          newRoot: {
            _id: "$_id",
            Product: { $first: "$Product" },
            batches: "$batches"
          }
        }
      }

    ]);



    res.json({ status: true, data: result, message: 'loaded' });
  } catch (error) {
    res.json({ status: false, message: error });
  }
}

export async function updateStatus(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let tailerFinishModel = await getTailerFinishModel(companyId);
    const { status: newStatus } = req.body;
    const itemId = req.params.id;

    const result = await tailerFinishModel.updateOne(
      { _id: itemId },
      { $set: { status: newStatus } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }

    const updatedItem = await tailerFinishModel.findById(itemId);
    res.json({ status: true, data: updatedItem, message: "Status updated" });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

