import getPolicyModel from '../models/hmanager.policy.model.js';

export async function policyRegistration(req, res) {
    try {
        let policyModel = await getPolicyModel(); const { policyName, description, content, } = req.body;
        const existingPolicy = await policyModel.findOne({ policyName: policyName });      
          if (existingPolicy) {
            res.json({ status: false, message: `${policyName} Already exist` });
        } else {
           
            const createpolicy = new policyModel({
                policyName, description, content
            });

            let success = await createpolicy.save();
            if (success) {
                res.json({ status: true, data: createpolicy, message: "Policy Created Successfully" });
            } else {
                res.json({ status: false, message: 'Error while registering' });
            }
        }

    } catch (error) {
        if (error.code === 11000) {
            console.log(error)
            res.json({ message: 'policy exist', status: false });
        } else {
            console.log(error)
            res.json({ message: error, status: false });
        }
    }
}

export async function getPolicy(req, res) {
    try {
        let policyModel = await getPolicyModel();
        let success;
        if(req.params.id!=null){
           let id = req.params.id;

         success = await policyModel.findById(id);   
        }else{
            success = await policyModel.find();   

        }
      
        if (success) {
            res.json({ status: true, data: success, message: "Policy fetched Successfully" });
        } else {
            res.json({ status: false, message: 'Not found' });
        }
    } catch (error) {
        if (error.code === 11000) {
            console.log(error)
            res.json({ message: 'policy exist', status: false });
        } else {
            console.log(error)
            res.json({ message: error, status: false });
        }
    }
}



export async function policyUpdate(req, res) {
    try {
        let policyModel = await getPolicyModel();
        let options = { new: true };
        const { policyName, description, content } = req.body;

        const updateObj = {
            $set: {
                policyName, description, content
            }
        };

        const result = await policyModel.findByIdAndUpdate(req.params.id, updateObj, options);

        if (!result) {
            return res.json({ status: false, message: "Policy not found" });
        }

        res.json({ status: true, message: "Policy updated successfully", data: result });

    } catch (error) {
        console.log(error)
        res.json({ message: error.message || "Error updating policy", status: false });
    }
}


export async function deletePolicy(req, res) {
    try {
        let policyModel = await getPolicyModel();
        let data;

        data = await policyModel.findByIdAndDelete(req.params.id);
    
            res.status(200).json({ status: true, message: "Policy deleted successfully." });

        
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}













