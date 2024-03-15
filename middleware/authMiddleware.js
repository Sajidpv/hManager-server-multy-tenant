import jsonwebtoken from 'jsonwebtoken';
import getUserModel from "../models/user.model.js";
import getCompanyModel from "../models/company.model.js";

export function checkAuth(req, res, next) {

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(200).json({ status: false, message: "Unauthorized: Bad token provided" });
  }

  jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(200).json({ status: false, message: "Unauthorized: Invalid token or User is inactivated" });
    }
    req.user = decoded;
    next();

  });
}

export function checkAdminAuth(req, res, next) {

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(200).json({ status: false, message: "Unauthorized: Bad token provided" });
  }

  jsonwebtoken.verify(token, process.env.SECRET_KEY_ADMIN, (err, decoded) => {
    if (err) {
      return res.status(200).json({ status: false, message: "Unauthorized: Invalid token " });
    }
    req.user = decoded;
    next();

  });
}


export function checkPermission(requiredPermission) {
  return async (req, res, next) => {
    try {
    
      let companyId = req.user.companyId;
      let companyModel =await getCompanyModel();  
      const company = await companyModel.findOne({ _id: companyId });
      if (company.status === 'Active') {
        let userModel = await getUserModel(companyId);
        const userId = req.user._id;

        const user = await userModel.findById(userId);

        if (!user || user.status == 'Inactive') {
          return res.json({ status: false, data: companyId, message: "User not found OR User is Inactive" });
        }

        const userPermissions = user.resourcePermissions || [];

        const hasPermission = userPermissions.some(permission => {
          return (
            permission.resource === requiredPermission.resource &&
            permission.permissions.get(requiredPermission.permission) === true
          );
        });
        if (hasPermission) {
          req.user = user;
          next();
        } else {
          return res.json({ status: false, message: "Forbidden: Insufficient permissions" });
        }
      } else {
        return res.json({ status: false, message: "Forbidden: Company is not activated" });

      }

    } catch (error) {

      return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  };
}