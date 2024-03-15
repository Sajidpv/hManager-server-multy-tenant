import getAdminModel from "../models/admin.model.js";
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

export async function adminRegistration(req, res) {
    try {
        let adminModel = await getAdminModel();
        const existingAdmin = await adminModel.findOne();
        if (existingAdmin) {
            res.json({ status: false, message: 'Already exist' });
        } else {
            const { name, mobile, email, password, } = req.body;
            const createAdmin = new adminModel({
                name, mobile, email, password,
            });

            let success = await createAdmin.save();
            if (success) {
                res.json({ status: true, data: createAdmin, message: "Admin Created Successfully" });
            } else {
                res.json({ status: false, message: 'Error while registering' });
            }
        }

    } catch (error) {
        if (error.code === 11000) {
            console.log(error)
            res.json({ message: 'Admin exist', status: false });
        } else {
            console.log(error)
            res.json({ message: error, status: false });
        }
    }
}

export async function getAdmin(req, res) {
    try {
        let adminModel = await getAdminModel();
        let id = req.params.id;

        let success = await adminModel.findById(id);
        if (success) {
            res.json({ status: true, data: success, message: "Admin fetched Successfully" });
        } else {
            res.json({ status: false, message: 'Error while registering' });
        }
    } catch (error) {
        if (error.code === 11000) {
            console.log(error)
            res.json({ message: 'Admin exist', status: false });
        } else {
            console.log(error)
            res.json({ message: error, status: false });
        }
    }
}



export async function adminUpdate(req, res) {
    try {
        let adminModel = await getAdminModel();
        const { id, mobile,
            userType,
            name,
            email,
            password, } = req.body;

        const updateObj = {
            $set: {
                mobile,
                userType,
                name,
                email
            }
        };


        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashpass = await bcrypt.hash(password, salt);
            updateObj.$set.password = hashpass;
        }

        const result = await adminModel.findOneAndUpdate(
            { _id: id },
            updateObj,
            { new: true }
        );

        if (!result) {
            return res.json({ status: false, message: "Admin not found" });
        }

        res.json({ status: true, message: "Admin updated successfully", data: result });

    } catch (error) {
        console.log(error)
        res.json({ message: error.message || "Error updating admin", status: false });
    }
}




export async function adminLogin(req, res, next) {
    try {
        const { email, password } = req.body;
        let adminModel = await getAdminModel();
        const user = await adminModel.findOne({ email: email });
        if (user) {

            const isMatched = await user.comparePassword(password);
            if (isMatched === false) {
                res.json({ status: false, message: "Invalid Credentials" });
            } else {
                let tokenData = { _id: user._id, email: user.email, userType: user.userType };

                const token = await jsonwebtoken.sign(tokenData, process.env.SECRET_KEY_ADMIN, { expiresIn: '5h' });
                res.status(200).json({ status: true, data: token, message: "Logged in Succefully" });
            }

        } else {
            res.json({ status: false, message: "Id not Found." });
        }
    } catch (error) {
        console.log(error)
        res.json({ status: false, message: error });

    }
}

export function checkTokenAdmin(req, res) {
    return res.status(200).json({ status: true, message: "Authorized: Token valid" });
}




export async function updateAdminPassword(req, res) {
    const { oldpass, newpass, id } = req.body;

    try {
        let adminModel = await getAdminModel();

        const user = await adminModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ status: false, message: 'Not found' });
        }

        const isMatched = await bcrypt.compare(oldpass, user.password);

        if (!isMatched) {
            return res.status(200).json({ status: false, message: "Incorrect password" });
        }

        const hashedPassword = await bcrypt.hash(newpass, 10);

        const result = await adminModel.updateOne(
            { _id: req.params.id },
            { $set: { password: hashedPassword } }
        );


        if (result.nModified === 0) {
            return res.status(200).json({ status: false, message: "Password update failed" });
        }

        res.status(200).json({ status: true, message: "Password changed successfully." });
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, message: error.message });
    }
}












