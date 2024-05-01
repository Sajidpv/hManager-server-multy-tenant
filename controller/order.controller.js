import getOrderModel from "../models/order_model.js";
import getCounterModel from "../models/counter.model.js";
import getStockCategoryModel from "../models/stock_categories.model.js";
import getStockItemsModel from "../models/stock_items.model.js";
import getSupplierModel from "../models/supplier.model.js";

export async function registerOrder(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let orderModel = await getOrderModel(companyId);
        let counterModel = await getCounterModel(companyId);
        const { date,orderType, categoryId,itemId,customerId,items} = req.body;
        console.log(itemId)
        let counter = await counterModel.findOne({ id: "orderNo" });

        let seqId;
        if (!counter) {
          const newCounter = new counterModel({ id: "orderNo", seq: 1000 });
          await newCounter.save();
          seqId = newCounter.seq.toString().padStart(2, "0");
        } else {
          counter.seq += 1;
          await counter.save();
          seqId = counter.seq.toString().padStart(2, "0");
        }
        const createOrder = new orderModel({ date: date, orderType: orderType, orderNo: seqId, categoryId: categoryId, itemId: itemId,customerId:customerId, items: items });
         await createOrder.save();

            res.json({ status: true,data:createOrder, message: "Order Placed Succefully" });
        

    } catch (error) {
        res.json({status:false,message:error.message});
    }
}


export async function getOrder(req, res) {
    try {
        let companyId = req.user.companyId;
        let orderModel = await getOrderModel(companyId);
        let result = await orderModel.find()
        .populate({path:'categoryId',model: await getStockCategoryModel(companyId)})
        .populate({path:'itemId',model: await getStockItemsModel(companyId)})
        .populate({path:'customerId',model: await getSupplierModel(companyId)});   
        res.json({ status: true,data:result, message: "Order Loaded Succefully" });
    } catch (error) {
        res.json({status:false,message:error.message});
    }
}


export async function deleteOrder(req, res) {
    try {
        let companyId = req.user.companyId;
        let orderModel = await getOrderModel(companyId);
        const item = await orderModel.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.json({ status: false, message: "Order not found" });
        }

        res.json({ status: true, message: "Order deleted successfully" });

    } catch (error) {
        res.json({ status: false, message: error.message || "Error deleting Order" });
    }
}

export async function updateStatus(req, res) {
    try { let companyId = req.user.companyId;
        let orderModel = await getOrderModel(companyId);
        const { id } = req.params;
        const { status: newStatus } = req.body;
        const options = { new: true };

        const updatedOrder = await orderModel.findByIdAndUpdate(
            id,
            { $set: { status: newStatus } },
            options
        );

        if (updatedOrder) {
            res.json({ status: true, message: 'Status changed to ' + newStatus, data: updatedOrder });
        } else {
            res.json({ status: false, message: 'No Order found' });
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
}

