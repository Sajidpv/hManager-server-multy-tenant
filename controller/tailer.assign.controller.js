
import getCutterFinishModel from "../models/cutter.finish.model.js";
import getStockModel from "../models/stock.model.js";
import getStockItemsModel from "../models/stock_items.model.js";
import getTailerAssignModel from "../models/tailer.assign.model.js";
import getUserModel from "../models/user.model.js";

export async function assignTailer(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let tailerAssignModel = await getTailerAssignModel(companyId);
        const    { date,batchId,productId,stockId,employId,color,size,assignedQuantity,cutterFinishId} = req.body;
    
        const addToAssign = new tailerAssignModel({ date:date,batchId:batchId,productId:productId,stockId:stockId,cutterFinishId:cutterFinishId,employId:employId,color:color,size:size,assignedQuantity:assignedQuantity});
         await addToAssign.save();
        res.json({ status: true,data:addToAssign, message: "Assigned Succefully" });
    } catch (error) {
        res.json({ status: false, message:error });
    }
}

export async function getAssignTailer(req, res,next) {
  try {
      let companyId = req.user.companyId;
      let tailerAssignModel = await getTailerAssignModel(companyId);
      const result = await tailerAssignModel.find().populate({path:'productId',model:await getStockItemsModel(companyId)})
      .populate({path:'stockId',model:await getStockModel(companyId),populate:{path:'itemId',model:await getStockItemsModel(companyId)}})
      .populate({path:'employId',model:await getUserModel(companyId)})
      .populate({path:'cutterFinishId',model:await getCutterFinishModel(companyId)})
  
      res.json({ status: true, message:'loaded',data:result });
  } catch (error) {
   
      res.json({ status: false, message:error });
  }
}

// export async function getAssignTailer(req, res,next) {
//     try {
//         let companyId = req.user.companyId;
//         let tailerAssignModel = await getTailerAssignModel(companyId);
//         const result = await tailerAssignModel.aggregate([
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
//                 from: "stocks",
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
//             },{
//               $unwind:"$material"
//             },
//             {
//               $lookup: {
//                 from: "materials", 
//                 localField: "material.name",
//                 foreignField: "_id",
//                 as: "materialInfo"
//               }
//             },
//             {$unwind:"$materialInfo"}
//           ]).exec();
    
//         res.json({ status: true, message:'loaded',data:result });
//     } catch (error) {
//         res.json({ status: false, message:error });
//     }
// }
     

           
export async function updateStatus(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let tailerAssignModel = await getTailerAssignModel(companyId);
        const { status: newStatus } = req.body;
        const itemId = req.params.id;

        const result = await tailerAssignModel.updateOne(
            { _id: itemId },
            { $set: { status: newStatus } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ status: false, message: "Item not found" });
        }

        const updatedItem = await tailerAssignModel.findById(itemId);
        res.json({ status: true, data: updatedItem, message: "Status updated" });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}
