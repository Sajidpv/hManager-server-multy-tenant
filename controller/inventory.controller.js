import getInventoryModel from "../models/inventory.model.js";
import getCounterModel from "../models/counter.model.js";

export async function registerInventory(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let inventoryModel = await getInventoryModel(companyId);
        let counterModel = await getCounterModel(companyId);
        const { date,item, source,destination,orderNo,quantity,amount,transactionType} = req.body;
       
        let counter = await counterModel.findOne({ id: "inventoryNo" });

        let seqId;
        if (!counter) {
          const newCounter = new counterModel({ id: "inventoryNo", seq: 1000 });
          await newCounter.save();
          seqId = newCounter.seq.toString().padStart(2, "0");
        } else {
          counter.seq += 1;
          await counter.save();
          seqId = counter.seq.toString().padStart(2, "0");
        }
        const createInventory = new inventoryModel({ date: date, inventoryId: seqId, item: item, source: source, destination: destination, orderNo: orderNo, quantity: quantity, amount: amount, transactionType: transactionType });
         await createInventory.save();
            res.json({ status: true,data:createInventory, message: "Inventory recorded succesfully" });
        

    } catch (error) {
        res.json({ status: false, message: error });
    
    }
}


export async function getInventories(req, res) {
    try {
        let companyId = req.user.companyId;
        let inventoryModel = await getInventories(companyId);
        let data = await  inventoryModel.find();

        res.json({ status: true,data:data, message:'Loaded' });
    } catch (error) {
        res.json({ status: false, message:error });
}}


