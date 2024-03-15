import getSizeModel from "../models/size.model.js";

export async function registerSizes(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let sizeModel = await getSizeModel(companyId);
        const { size } = req.body;
        const CapSize = size.toUpperCase() 
        const item = await sizeModel.findOne({ CapSize });
        
        if (item) {
            res.json({ status: false, message: "Size already exist" });
        } else {
            const addSize = new sizeModel({size:CapSize});
            await addSize.save();

            res.json({ status: true,data:addSize, message: "Size added Succefully" });
        }

    } catch (error) {
        res.json({ status: false, message:error });
    }
}


export async function deleteSizes(req, res) {
    try {
        let companyId = req.user.companyId;
        let sizeModel = await getSizeModel(companyId);
        const item = await sizeModel.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.json({ status: false, message: "Size not found" });
        }

        res.json({ status: true, message: "Size deleted successfully" });

    } catch (error) {
        res.json({ status: false, message: error.message || "Error deleting Size" });
    }
}

export async function getSizes(req, res) {
    try {
        let companyId = req.user.companyId;
        let sizeModel = await getSizeModel(companyId);
        let data = await sizeModel.find();

        res.json({ status: true, message:'loaded',data:data });
    } catch (error) {
        res.json({ status: false, message:error });
    }
}

