import getPurchaseModel from "../models/purchase.model.js";
import getCounterModel from "../models/counter.model.js";
import getGodownModel from "../models/godown.model.js";
import getStockCategoryModel from "../models/stock_categories.model.js";
import getSupplierModel from "../models/supplier.model.js";
import getStockItemsModel from "../models/stock_items.model.js";
export async function registerPurchase(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let purchaseModel = await getPurchaseModel(companyId);
        let counterModel = await getCounterModel(companyId);
        const { date, supplier, invoice, description, discountType, godownId, billDiscount, igst, sgst, cgst, cess, items, grossAmount, netAmount, orderNo } = req.body;

        let counter = await counterModel.findOne({ id: "purID" });

        let seqId;
        if (!counter) {
            const newCounter = new counterModel({ id: "purID", seq: 1 });
            await newCounter.save();
            seqId = "PUR" + newCounter.seq.toString().padStart(4, "0");
        } else {
            counter.seq += 1;
            await counter.save();
            seqId = "PUR" + counter.seq.toString().padStart(4, "0");
        }

        const addPurchase = new purchaseModel({ date: date, supplier: supplier, purID: seqId, invoice: invoice, description: description, discountType: discountType, godownId: godownId, billDiscount: billDiscount, igst: igst, sgst: sgst, cgst: cgst, cess: cess, items: items, grossAmount: grossAmount, netAmount: netAmount, orderNo: orderNo });
        await addPurchase.save();
        res.json({ status: true, data: addPurchase, message: "Purchase added Succefully" });
    } catch (error) {
        res.json({ status: false, message: error });
        console.log(error);
    }
}


export async function getPurchase(req, res) {
    try {
        let companyId = req.user.companyId;
        let purchaseModel = await getPurchaseModel(companyId);
        let result = await purchaseModel.find()
        .populate({ path: 'supplier', model: await getSupplierModel(companyId) })
        .populate({ path: 'godownId', model: await getGodownModel(companyId) })
        .populate({ path: 'items.categoryId', model: await getStockCategoryModel(companyId) })
        .populate({ path: 'items.itemId', model: await getStockItemsModel(companyId) });

        res.json({ message: 'Purchase loaded', data: result, status: true });
    } catch (error) {
        res.json({ status: false, message: error });
    }
}









