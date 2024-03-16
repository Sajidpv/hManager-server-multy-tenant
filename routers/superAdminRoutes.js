import express from "express";
import { adminRegistration,getAdmin,adminUpdate,adminLogin,checkTokenAdmin,updateAdminPassword } from "../controller/admin.controller.js";
import { checkAdminAuth } from "../middleware/authMiddleware.js";
import { register, getCompany,activateCompany ,changeCompanyPassword,deleteCompany} from "../controller/company.controller.js";
import { registerUser,getOwner,updateOwner } from "../controller/user.controller.js";
import { policyRegistration,getPolicy,policyUpdate,deletePolicy } from "../controller/policy.controller.js";
const router=express()

router.post('/register-admin',adminRegistration);

router.get('/get-admin/:id',checkAdminAuth,getAdmin);

router.put('/update-admin-details',checkAdminAuth, adminUpdate);

router.put('/change-password/:id',checkAdminAuth, updateAdminPassword);

router.post('/admin-login', adminLogin);

router.get('/check-admin-token',checkAdminAuth,checkTokenAdmin);

router.post('/register-company',register);

router.get('/admin-get-company',checkAdminAuth, getCompany);

router.get('/get-company/:id',checkAdminAuth, getCompany);

router.put('/activate-company/:id',checkAdminAuth, activateCompany,registerUser);

router.get('/get-owner/:companyId',checkAdminAuth, getOwner);

router.put('/update-owner-details/:companyId',checkAdminAuth, updateOwner,changeCompanyPassword);

router.delete('/delete-company/:companyId',checkAdminAuth, deleteCompany);

router.post('/policy/add-policy', checkAdminAuth,policyRegistration);

router.put('/policy/update-policy/:id', checkAdminAuth,policyUpdate);

router.delete('/policy/delete-policy/:id', checkAdminAuth,deletePolicy);

router.get('/policy/get-policy', checkAdminAuth,getPolicy);

router.get('/policy/get-policy/:id', checkAdminAuth,getPolicy);

export default router;