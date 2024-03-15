import getGodownModel from "../models/godown.model.js";
import getCounterModel from "../models/counter.model.js";

export async function registerGodowns(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let godownModel = await getGodownModel(companyId);
        let counterModel = await getCounterModel(companyId);
        const { name, location, capacity,isPrimary } = req.body;
        const formattedName = name.charAt(0).toUpperCase() +
            name.slice(1).toLowerCase();

        const item = await godownModel.findOne({ formattedName });  

        if (item) { return res.json({ status: false, message: 'Godownname already exist' }); } else {
     
            const existingPrimaryGodown = await godownModel.findOne({ isPrimary: true });

 
            if (existingPrimaryGodown && isPrimary) {
                console.log('here');
                existingPrimaryGodown.isPrimary = false;
                existingPrimaryGodown.save();
            }

            let counter = await counterModel.findOne({ id: "godownNo" });

            let seqId;
            if (!counter) {
                const newCounter = new counterModel({ id: "godownNo", seq: 1000 });
                await newCounter.save();
                seqId = newCounter.seq.toString().padStart(2, "0");
            } else {
                counter.seq += 1;
                await counter.save();
                seqId = counter.seq.toString().padStart(2, "0");
            }
            const createGodown = new godownModel({ godownId:seqId,name:formattedName,location:location, capacity:capacity,isPrimary:isPrimary });
             await createGodown.save();
            res.json({ status: true, data: createGodown, message: "Godown registred Succefully" });
        }
    } catch (error) {
        res.json({ status: false, message: error.message });
    }

}

export async function update(req, res) {
    try {
        let companyId = req.user.companyId;
        let godownModel = await getGodownModel(companyId);
        const { id, bData } = req.body;

        const {
            name,
            location,
            capacity,
            isPrimary,
        } = bData;

        const formattedName = name.charAt(0).toUpperCase() +
            name.slice(1).toLowerCase();

        const existingGodown = await godownModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    name: formattedName,
                    location: location,
                    capacity: capacity,
                    isPrimary: isPrimary,
                },
            },
            { new: true }
        );

        if (!existingGodown) {
            return res.json({ status: false, message: "Godown not found" });
        } else {
            if (isPrimary) {
                await godownModel.updateMany({ isPrimary: true, _id: { $ne: id } }, { $set: { isPrimary: false } });
            }

            res.json({ status: true, data: existingGodown, message: "Godown updated successfully" });
        }
    } catch (error) {
        res.json({ status: false, message: error.message || "Error updating godown" });
    }
}




export async function deleteGodown(req, res) {
    try {
        let companyId = req.user.companyId;
        let godownModel = await getGodownModel(companyId);
        const existingGodown = await godownModel.findByIdAndDelete(req.params.id);
        if (!existingGodown) {
            return res.json({ status: false, message: "Godown not found" });
        }

        res.json({ status: true, message: "Godown deleted successfully" });

    } catch (error) {
        res.json({ status: false, message: error.message || "Error deleting color" });
    }
}


export async function getGodowns(req, res) {
    try {  let companyId = req.user.companyId;
        let godownModel = await getGodownModel(companyId);
        let data = await godownModel.find();

        res.json({ status: true, data: data, message: "Godown Loaded Succefully" });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
}


