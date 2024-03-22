import getUserModel from "../models/user.model.js";
import bcrypt from 'bcrypt';
import getCompanyModel from "../models/company.model.js";
import getCounterModel from "../models/counter.model.js";
import jsonwebtoken from 'jsonwebtoken';
import getGodownModel from "../models/godown.model.js";


export async function registerUser(req, res) {
    try {
        let companyId = req.user.companyId;
        let userModel = await getUserModel(companyId);
        let companyModel = await getCompanyModel();
        let counterModel = await getCounterModel(companyId);

        const { salary, accDetails, mobile, gender, userType, jobType, name, email, status, password } = req.body;

        const item = await companyModel.findOne({ _id: companyId });
        if (!item) {
            res.status(404).json({ status: false, message: "Company not found" });
        } else {
            const item = await userModel.findOne({ email: email });
            if (item) {
                res.json({ status: false, message: "User Already registered" });

            } else {
                let counter = await counterModel.findOne({ id: "empId" });

                let seqId;
                if (!counter) {
                    const newCounter = new counterModel({ id: "empId", seq: 1 });
                    await newCounter.save();
                    seqId = "EMP" + newCounter.seq.toString().padStart(4, "0");
                } else {
                    counter.seq += 1;
                    await counter.save();
                    seqId = "EMP" + counter.seq.toString().padStart(4, "0");
                }
                const createUser = new userModel({
                    gender: gender, userType: userType, jobType: jobType, salary: salary, accDetails: accDetails, mobile: mobile,
                    email: email,
                    password: password,
                    empID: seqId,
                    name: name,
                    status: status,
                    companyId: companyId
                });

                createUser.setDefaultPermissions(companyId);

                const successRes = await createUser.save();
                if (successRes) {
                    res.json({ status: true, data: createUser, message: "User Registered Successfully" });
                } else {
                    res.json({ status: false, message: "Error Registering employ" });
                }

            }
        }
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            res.json({ message: 'User already exist', status: false });
        } else {
            res.json({ message: error, status: false });
        }
    }
}


export async function update(req, res) {
    try {
        let companyId = req.user.companyId;
        let userModel = await getUserModel(companyId);
        const { id, eModel } = req.body;

        const {
            salary,
            accDetails,
            mobile,
            gender,
            userType,
            jobType,
            name,
            email,
            status,
            password,
        } = eModel;

        // Construct the update object
        const updateObj = {
            $set: {
                salary,
                accDetails,
                mobile,
                gender,
                userType,
                jobType,
                name,
                email,
                status,
            }
        };

        // Add password to update object only if it is present
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashpass = await bcrypt.hash(password, salt);
            updateObj.$set.password = hashpass;
        }

        const result = await userModel.findOneAndUpdate(
            { _id: id },
            updateObj,
            { new: true } // Return the modified document
        );

        if (!result) {
            return res.json({ status: false, message: "User not found" });
        }

        res.json({ status: true, message: "User updated successfully", data: result });

    } catch (error) {
        res.json({ message: error.message || "Error updating user", status: false });
    }
}

export async function updateOwner(req, res, next) {
    try {
        let companyId = req.params.companyId;
        let userModel = await getUserModel(companyId);
        const { id, eModel } = req.body;

        const {
            salary,
            accDetails,
            mobile,
            gender,
            userType,
            jobType,
            name,
            email,
            status,
            password,
        } = eModel;

        // Construct the update object
        const updateObj = {
            $set: {
                salary,
                accDetails,
                mobile,
                gender,
                userType,
                jobType,
                name,
                email,
                status,
            }
        };

        // Add password to update object only if it is present
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashpass = await bcrypt.hash(password, salt);
            updateObj.$set.password = hashpass;
        }

        const result = await userModel.findOneAndUpdate(
            { _id: id },
            updateObj,
            { new: true } // Return the modified document
        );

        if (!result) {
            return res.json({ status: false, message: "Owner not found" });
        }
        if (password) {
            next();
        } else {
            res.json({ status: true, message: "Owner updated successfully", data: result });

        }

    } catch (error) {
        res.json({ message: error.message || "Error updating user", status: false });
    }
}




export async function login(req, res, next) {
    try {
        const { companyMail, email, password } = req.body;
        let companyModel = await getCompanyModel();

        let company = await companyModel.findOne({ email: companyMail });

        if (company) {
            if (company.status == "Inactive") {
                res.json({ status: false, message: "Company not Activated." });
            } else {
                let userModel = await getUserModel(company._id);
                const user = await userModel.findOne({ email });

                if (user && user.status == 'Inactive') {
                    res.json({ status: false, message: "User is inactive" });
                } else if (user && user.status == 'Active') {
                    const isMatched = await user.comparePassword(password);
                    if (isMatched === false) {
                        res.json({ status: false, message: "Invalid Credentials" });
                    } else {
                        let tokenData = { _id: user._id, email: user.email, userType: user.userType, status: user.status, companyId: user.companyId };

                        const token = await jsonwebtoken.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '6d' });
                        res.status(200).json({ status: true, data: token, message: "Logged in Succefully" });
                    }
                } else {
                    res.json({ status: false, message: "User doesnot exist" });
                }
            }
        } else {
            res.json({ status: false, message: "Company not registered." });
        }
    } catch (error) {
        console.log(error)
        res.json({ status: false, message: error });

    }
}

export function checkToken(req, res) {
    return res.status(200).json({ status: true, message: "Authorized: Token valid" });
}


export async function getEmployee(req, res) {
    try {
        let companyId = req.user.companyId;
        let userModel = await getUserModel(companyId);
        let godownmode = await getGodownModel(companyId);
        let data = await userModel.find().populate({ path: 'godownAccess', model: godownmode }).populate({ path: 'companyId', model: await getCompanyModel() });
        res.status(200).json({ status: true, data: data, message: "Users Loaded" });

    } catch (error) {
        console.log(error)
        res.json({ status: false, message: "Failed to fetch users" });
    }
}

export async function getOwner(req, res) {
    try {
        let companyId = req.params.companyId;
        let userModel = await getUserModel(companyId);
        let godownmode = await getGodownModel(companyId);
        let data = await userModel.findOne({ userType: 'Owner' }).populate({ path: 'godownAccess', model: godownmode }).populate({ path: 'companyId', model: await getCompanyModel() });
        res.status(200).json({ status: true, data: data, message: "Users Loaded" });

    } catch (error) {
        console.log(error)
        res.json({ status: false, message: "Failed to fetch users" });
    }
}

export async function getEmployeeById(req, res) {
    try {
        let companyId = req.user.companyId;
        let userModel = await getUserModel(companyId);
        let godownmode = await getGodownModel(companyId);

        let data = await userModel.findById(req.params.id).populate({ path: 'godownAccess', model: godownmode }).populate({ path: 'companyId', model: await getCompanyModel() });
        if (!data) {
            res.json({ status: false, message: "No user found" });
        } else {
            res.json({ status: true, data: data, message: "User loaded" });
        }

    } catch (error) {
        console.log(error)
        res.json({ status: false, message: "Failed to fetch user" });
    }
}




export async function updatePassword(req, res) {
    const { oldpass, newpass, empId } = req.body;

    try {
        let companyId = req.user.companyId;
        let userModel = await getUserModel(companyId);
        const user = await userModel.findById(empId);

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        const isMatched = await bcrypt.compare(oldpass, user.password);

        if (!isMatched) {
            return res.status(200).json({ status: false, message: "Incorrect password" });
        }

        const hashedPassword = await bcrypt.hash(newpass, 10);

        const result = await userModel.updateOne(
            { _id: empId },
            { $set: { password: hashedPassword } }
        );

        if (result.nModified === 0) {
            return res.status(200).json({ status: false, message: "Password update failed" });
        }

        res.status(200).json({ status: true, message: "Password changed successfully." });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}





export async function updateStatus(req, res) {
    let companyId = req.user.companyId;
    let userModel = await getUserModel(companyId);
    let id = req.params.id;
    let options = { new: true };
    const item = await userModel.findById(id);
    if (item) {

        try {
            const data = await userModel.findByIdAndUpdate(id, { status: req.body.status }, options);
            res.json({ status: true, message: 'Update status' });
        } catch (error) {
            res.json({ status: false, message: error.message });

        }

    } else {
        res.json({ status: false, data: data, message: "No employee found" });
    }

}

export async function updatePermissions(req, res) {
    const id = req.params.id;
    let companyId = req.user.companyId;
    let userModel = await getUserModel(companyId);
    const { resourcePermissions } = req.body;

    try {
        const result = await userModel.updateOne(
            { _id: id, "resourcePermissions._id": resourcePermissions.resourceId },
            {
                $set: {
                    "resourcePermissions.$.permissions": resourcePermissions.permissions,
                },
            }
        );

        if (result.nModified === 0) {
            return res.json({ status: false, message: 'Resource not found in permissions' });
        }

        const updatedUser = await userModel.findById(id);
        res.json({ status: true, data: updatedUser, message: 'Permission modified' });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
}

export async function updateGodownAccess(req, res) {
    const id = req.params.id;
    let companyId = req.user.companyId;
    let userModel = await getUserModel(companyId);
    const { godownAccess } = req.body;

    try {
        const result = await userModel.updateOne(
            { _id: id },
            {
                $set: {
                    "godownAccess": godownAccess
                },
            }
        );

        if (result.nModified === 0) {
            return res.json({ status: false, message: 'Resource not found in permissions' });
        }

        const updatedUser = await userModel.findById(id);
        res.json({ status: true, data: updatedUser, message: 'Access modified' });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
}



export async function deleteUser(req, res) {
    try {
        let companyId = req.user.companyId;
        let userModel = await getUserModel(companyId);
        let data;
        data = await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: true, data: data, message: 'Deleted Succesfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

}








