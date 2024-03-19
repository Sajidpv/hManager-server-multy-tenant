
import getFinishedModel from "../models/finished.model.js";
import getFinisherAssignModel from "../models/finisher.assign.model.js";
import getStockModel from "../models/stock.model.js";
import getStockItemsModel from "../models/stock_items.model.js";
import getUserModel from "../models/user.model.js";

export async function registerFinishItems(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let finishedModel = await getFinishedModel(companyId);
        const    { date,finisherAssignID,batchId,productId,materialId,employId,color,size,finishedQuantity,damage,quantity} = req.body;
    
        const addToAssign = new finishedModel({ date:date,finisherAssignID:finisherAssignID,batchId:batchId,productId:productId,materialId:materialId,employId:employId,color:color,size:size,finishedQuantity:finishedQuantity,damage:damage,quantity:quantity});
         await addToAssign.save();
        res.status(200).json({ status: true,data:addToAssign, message: "Finished Succefully" });
    } catch (error) {
        res.json({ status: false, message:error });
    }
}

export async function getFinishedItems(req,res){
  try {
    let companyId = req.user.companyId;
    let finishedModel = await getFinishedModel(companyId);
    const result = await finishedModel.find().populate({path:'finisherAssignID',model:await getFinisherAssignModel(companyId)})
    .populate({path:'productId',model:await getStockItemsModel(companyId)})
    .populate({path:'materialId',model:await getStockItemsModel(companyId)})
    .populate({path:'employId',model:await getUserModel(companyId)});

      res.json({ status: true,data:result, message:'loaded' });
  } catch (error) {

    res.json({ status: false, message:error });
  }
}


export async function getFinishedData(req, res,next) {
    try {
        let companyId = req.user.companyId;
        let finishedModel = await getFinishedModel(companyId);
        const result = await finishedModel.aggregate([
            {
              $group: {
                _id: {
                  productId: "$productId",
                  batchId: "$batchId",
                  materialId: "$materialId",
                },
                colors: {
                  $push: {
                    color: "$color",
                    quantity: "$finishedQuantity",
                  },
                },
              },
            },
            {
              $group: {
                _id: {
                  productId: "$_id.productId",
                },
                batches: {
                  $push: {
                    batchId: "$_id.batchId",
                    materialId: "$_id.materialId",
                    colors: "$colors",
                  },
                },
              },
            },
            {
              $unwind: "$batches",
            },
            {
              $lookup: {
                from: "stocks",
                localField: "batches.materialId",
                foreignField: "_id",
                as: "materialStock",
              },
            },
            {
              $lookup: {
                from: "stock-category-items",
                localField: "batches.materialId",
                foreignField: "_id",
                as: "materialInfo",
              },
            },
            {
              $group: {
                _id: "$_id",
                batches: {
                  $push: {
                    batchId: "$batches.batchId",
                    materialId: "$batches.materialId",
                    colors: {
                      $reduce: {
                        input: "$batches.colors",
                        initialValue: [],
                        in: {
                          $cond: [
                            { $in: ["$$this.color", "$$value.color"] },
                            {
                              $map: {
                                input: "$$value",
                                as: "item",
                                in: {
                                  $cond: [
                                    { $eq: ["$$item.color", "$$this.color"] },
                                    {
                                      color: "$$item.color",
                                      quantity: {
                                        $add: ["$$item.quantity", "$$this.quantity"],
                                      },
                                    },
                                    "$$item",
                                  ],
                                },
                              },
                            },
                            { $concatArrays: ["$$value", ["$$this"]] },
                          ],
                        },
                      },
                    },
                    materialInfo: { $arrayElemAt: ["$materialInfo", 0] },
                    materialStock: { $arrayElemAt: ["$materialStock", 0] },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "stock-category-items",
                localField: "_id.productId",
                foreignField: "_id",
                as: "Product",
              },
            },
          ]);
    
        res.json({ message: 'Loaded.. ', status: true,data:result });
    } catch (error) {
        res.json({ message: error, status: false });
    }
}
     


  