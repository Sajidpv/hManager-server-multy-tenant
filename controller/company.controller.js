import { error } from "console";
import getCompanyModel from "../models/company.model.js";
import getUserModel from "../models/user.model.js";

export async function register(req, res, next) {
    try {
        let companyModel = await getCompanyModel();
        const { name, financialYear, gstNo, panNo, addressLine1, addressLine2, country, state, zip, mobile, email, password, userType, payment, accDetails, status } = req.body;
        const item = await companyModel.findOne({ email: email }) || await companyModel.findOne({ gstNo: gstNo });

        if (item) {
            res.json({ status: false, message: "Company already registered " });
        } else {
            const company = new companyModel({ name, financialYear, gstNo, panNo, addressLine1, addressLine2, country, state, zip, mobile, email, password, userType, payment, accDetails, status });
            let success = await company.save();
            if (success) {
                res.json({ status: true, data: success, message: "Company Registered Succefully" });
            } else {
                res.json({ status: false, message: "Company Register failed" });
            }
        }

    } catch (error) {
        console.error(error);
        res.json({ message: 'Error occured, Try again.', status: false });

    }
}



export async function getCompany(req, res) {
    try {
        let companyModel = await getCompanyModel();
        let data;
        if (req.params.id) {
            data = await companyModel.findById(req.params.id);
        } else {
            data = await companyModel.find();
        }
        res.json({ message: 'Company Loaded ', data: data, status: true });
    } catch (error) {
        res.json({ message: error, status: false });
    }
}

export async function activateCompany(req, res, next) {
    let companyId = req.params.id;
    let companyModel = await getCompanyModel();
    let userModel = await getUserModel(companyId);
    try {
        let options = { new: true };
        const company = await companyModel.findById(companyId);
        console.log(companyId)
        if (company) {
            const data = await companyModel.findByIdAndUpdate(companyId, { status: req.body.status }, options);
            if (data) {
                const item = await userModel.findOne({ email: req.body.email }) || await userModel.findOne({ userType: 'Owner' });
                if (item) {
                    res.json({ status: true, message: 'Company Status updated' });
                } else if(!item&&req.body.status==='Active') {
                    req.user.companyId = companyId;
                    req.body.status='Active'
                    next();
                }
            } else {
                res.json({ status: false, message: 'Error while updating status' });
            }
        } else {
            res.json({ status: false, message: "No company found" });
        }
    } catch (e) {
        console.log(e)
        res.json({ status: false, message: e });
    }

}











