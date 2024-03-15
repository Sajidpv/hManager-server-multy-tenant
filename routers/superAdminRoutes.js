import express from "express";
import { adminRegistration,getAdmin,adminUpdate,adminLogin,checkTokenAdmin,updateAdminPassword } from "../controller/admin.controller.js";
import { checkAdminAuth } from "../middleware/authMiddleware.js";
import { register, getCompany,activateCompany } from "../controller/company.controller.js";
import { registerUser } from "../controller/user.controller.js";

const router=express()

router.post('/register-admin',adminRegistration);

router.get('/get-admin/:id',getAdmin);

router.put('/update-admin-details',checkAdminAuth, adminUpdate);

router.put('/change-password/:id',checkAdminAuth, updateAdminPassword);

router.post('/admin-login', adminLogin);

router.get('/check-admin-token',checkAdminAuth,checkTokenAdmin);

router.post('/register-company',register);

router.get('/admin-get-company',checkAdminAuth, getCompany);

router.get('/get-company/:id',checkAdminAuth, getCompany);

router.put('/activate-company/:id',checkAdminAuth, activateCompany,registerUser);



export default router;