import getSupplierModel from "../models/supplier.model.js";

export async function registerSupplier(req, res, next) {
    try {
        let companyId = req.user.companyId;
        let supplierModel = await getSupplierModel(companyId);
        const { name,gstNo, address, status,accDetails,type } = req.body;

        const item =await supplierModel.findOne({gstNo:gstNo});
        if(item){
            res.json({ status: false, message: "Supplier already registered" });
        }else{
            const createSupplier=new supplierModel({name,gstNo,address,status,accDetails,type});
            await createSupplier.save();
            res.json({ status: true,data:createSupplier, message: "Supplier Registered Succefully" });
        }        

    } catch (error) {
        if (error.code === 11000) {
            res.json({ message: 'Alredy Exist', status: false });
            console.log('already exist');
        } else {
            console.log(error);
            res.json({ message: error, status: false });
        }
    }
}

export async function updateSupplier(req, res) {
    try {
        let companyId = req.user.companyId;
        let supplierModel = await getSupplierModel(companyId);
        const { id, sData } = req.body;

        const {
            name,
            gstNo,
            address,
            status,
            accDetails,
            type,
        } = sData;

        const result = await supplierModel.updateOne(
            { _id: id },
            {
                $set: {
                    name,
                    gstNo,
                    address,
                    status,
                    accDetails,
                    type,
                }
            }
        );

        if (result.nModified === 0) {
            return res.json({ status: false, message: "Supplier not found" });
        }

        const updatedSupplier = await supplierModel.findById(id);

        res.json({ status: true, data: updatedSupplier, message: "Supplier updated successfully" });

    } catch (error) {
        res.json({ message: error.message || "Error updating supplier", status: false });
    }
}



export async function getSupplier(req, res) {
    try {
        let companyId = req.user.companyId;
        let supplierModel = await getSupplierModel(companyId);
        var data;
        if (req.params.id) {
             data = await supplierModel.findById(req.params.id);
        } else {
             data = await supplierModel.find();
        }
        res.json({ message: 'Suppliers Loaded',data:data, status: true });
    } catch (error) {
        res.json({ message: error, status: false });
    }
}

export async function deleteSupplier(req, res) {
    try {
        let companyId = req.user.companyId;
        let supplierModel = await getSupplierModel(companyId);
        let data;
             data = await supplierModel.findByIdAndDelete(req.params.id);
         res.json({message:'Deleted Succesfully',status:true,data:data});
    } catch (error) {
        res.json({ status: false, message:error });
    }
}


export async function updateStatus(req, res) {
    let companyId = req.user.companyId;
    let supplierModel = await getSupplierModel(companyId);
    let id =req.params.id;
    let options = { new: true };
    const item = await supplierModel.findById(id);
if(item){
    
  try {
        const data = await supplierModel.findByIdAndUpdate(id,{ status:req.body.status}, options);
        res.json({ status: true,data:item.save(), message: 'Update status'});
    } catch (error) {
        res.json({ message: error, status: false });

    }

}else{
    res.json({ status: false,message: " No Supplier found" });
}
  
}






    



