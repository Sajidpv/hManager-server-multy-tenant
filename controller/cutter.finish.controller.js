import getCutterAssignModel from "../models/cutter.assign.model.js";
import getStockItemsModel from "../models/stock_items.model.js";
import getUserModel from "../models/user.model.js";
import getCutterFinishModel from"../models/cutter.finish.model.js";
import getStockModel from "../models/stock.model.js";

export async function registerCutterFinish (req, res, next){
    try {
      let companyId = req.user.companyId;
      let cutterFinishModel = await getCutterFinishModel(companyId);
        const    {date,proAssignID,batchID,productId,materialId,employId,items } = req.body;

        const existingDocument = await cutterFinishModel. findOne({
          proAssignID: proAssignID,
          batchId: batchID
        });
  
        if (existingDocument) {
          const existingColors = existingDocument.items.map(item => item.color);
          const newColors = items.map(item => item.color);
    
          const duplicateColors = newColors.filter(color => existingColors.includes(color));
    
          if (duplicateColors.length > 0) {
            console.log('Aborting update due to duplicate colors:', duplicateColors);
            return res.status(200).json({ status: false, message: "Color already added" });
          }
 
          existingDocument.date = date;
          existingDocument.items.push(...items);
          await existingDocument.save();
        
          console.log('Document Updated');
          return existingDocument;
        } else {
          const addToFinish = new cutterFinishModel({
            date: date,
            proAssignID: proAssignID,
            batchId: batchID,
            productId:productId,
            materialId:materialId,
            employId:employId,
            items: items
          });

           await addToFinish.save();
           res.status(200).json({ status: true,data:addToFinish, message: "Finished Succefully" });
        }        

     
    } catch (error) {
        res.json({ status: false, message:error });
    }
}


export async function getFinishCutter(req, res, next) {
  try {
    let companyId = req.user.companyId;
    let cutterFinishModel = await getCutterFinishModel(companyId);

    const result = await cutterFinishModel.find()
      .populate({
        path: 'proAssignID',
        model: await getCutterAssignModel(companyId),
      }).populate({path: 'productId', model: await getStockItemsModel(companyId)}).populate({ path: 'employId', model: await getUserModel(companyId) })
      .populate( { path: 'materialId', model: await getStockModel(companyId), populate: { path: 'itemId', model: await getStockItemsModel(companyId) } });

    res.json({ message: 'Loaded successful', data: result, status: true });
  } catch (error) {
    res.json({ message: error, status: false });
  }
}



export async function getFinishCutterAggregate (req, res,next){
    try {
      let companyId = req.user.companyId;
      let cutterFinishModel = await getCutterFinishModel(companyId);
      const result = await cutterFinishModel.aggregate([
        {
          $group: {
            _id: "$productId",
            batches: {
              $push: {
                _id: "$_id",
                proAssignID:"$proAssignID",
                date: "$date",
                batchId: "$batchId",
                materialId: "$materialId",
                items: "$items"
              }
            }
          }
        },
        {
          $unwind: "$batches"
        },
        {
          $lookup: {
            from: 'assign-cutters',
            localField: "batches.proAssignID",
            foreignField: "_id",
            as: "Assignments"
          }
        },
        {
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
            localField: "batches.materialId",
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
        },
        {
          $group: {
            _id: "$_id",
            Product: { $first: "$Product" },
            batches: {
              $push: {
                finishId: "$batches._id",
                assignId:{$first:"$Assignments"},
                date: "$batches.date",
                batchId: "$batches.batchId",
                stockId: "$batches.materialId",
                items: "$batches.items",
                Material: {$first:"$Material"}
              }
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              _id: "$_id",
              Product: {$first:"$Product"},
              batches: "$batches"
            }
          }
        }
      ]).exec();
    
        res.json({ message: 'Loaded',data:result, status: true });
    } catch (error) {
      res.json({ message: error, status: false });
    }
}
           
export async function updateStatusCutterFinish(req, res, next){
  

  try {
    let companyId = req.user.companyId;
    let cutterFinishModel = await getCutterFinishModel(companyId);
    const { color, status: newStatus } = req.body;
    const itemId = req.params.id;

    const item = await cutterFinishModel.findById(itemId);

    if (item) {
      const colorItem = item.quantity.find((item) => item.color === color);

      if (colorItem) {
        colorItem.status = newStatus;

        await item.save();

        res.json({ status: true,data:item, message: "Status updated" });
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
  