
import getFinisherAssignModel from "../models/finisher.model.js";
import getStockItemsModel from "../models/stock_items.model.js";
import getTailerAssignModel from "../models/tailer.model.js";
import getTailerFinishModel from "../models/tailer.finish.model.js";
import getUserModel from "../models/user.model.js";

export async function assignFinisher(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let finisherAssignModel = await getFinisherAssignModel(companyId);
        const    { date,batchId,productId,stockId,employId,color,size,assignedQuantity,damageQuantity,finishedQuantity,balanceQuantity,tailerFinishId} = req.body;
    
        const addToAssign = new finisherAssignModel({ date:date,batchId:batchId,productId:productId,stockId:stockId,employId:employId,color:color,size:size,assignedQuantity:assignedQuantity,damageQuantity:0,finishedQuantity:0,balanceQuantity:assignedQuantity,tailerFinishId:tailerFinishId});
         await addToAssign.save();
        res.json({ status: true,data:addToAssign, message: "Assigned Succefully" });
    } catch (error) {
        res.json({ status: false, message:error });
    }
}

export async function getAssignFinisher(req, res,next) {
  try {
      let companyId = req.user.companyId;
      let finisherAssignModel = await getFinisherAssignModel(companyId);
      const result = await finisherAssignModel.find()
      .populate({path:'productId',model:await getStockItemsModel(companyId)})
      .populate({path:'materialId',model:await getStockItemsModel(companyId)})
      .populate({path:'employId',model:await getUserModel(companyId)})
      .populate({path:'tailerFinishId',model:await getTailerFinishModel(companyId)});
      
      res.json({ status: true,data:result, message:'loaded' });
  } catch (error) {
      res.json({ status: false, message:error });
  }
}

// export async function getAssignFinisher(req, res,next) {
//     try {
//         let companyId = req.user.companyId;
//         let finisherAssignModel = await getFinisherAssignModel(companyId);
//         const result = await finisherAssignModel.aggregate([
//             {
//               $lookup: {
//                 from: "products",
//                 localField: "productId",
//                 foreignField: "_id",
//                 as: "product"
//               }
//             },
           
//             {
//               $lookup: {
//                 from: "materials",
//                 localField: "materialId",
//                 foreignField: "_id",
//                 as: "material"
//               }
//             },
       
//             {
//               $lookup: {
//                 from: "users",
//                 localField: "employId",
//                 foreignField: "_id",
//                 as: "employ"
//               }
//             }
//           ]).exec();
    
//         res.json({ status: true,data:result, message:'loaded' });
//     } catch (error) {
//         res.json({ status: false, message:error });
//     }
// }
     

export async function updateStatus(req, res, next) {

    try {
        let companyId = req.user.companyId;
        let finisherAssignModel = await getFinisherAssignModel(companyId);
        const { status: newStatus } = req.body;
        const itemId = req.params.id;
    
        const item = await finisherAssignModel.findById(itemId);
    
        if (item) {
         
            item.status = newStatus;
  
            await item.save();
    
            res.json({ status: true,data:item, message: "Status updated" });
          } else {
            res.status(404).json({ status: false, message: "Item not found" });
          }
      } catch (error) {
        res.status(500).json({ status: false, message: error });
      }


  }
  