import express from "express";
import { register } from "../controller/company.controller.js";
import {  login } from "../controller/user.controller.js";

const router=express()

router.post('/register_company',register);

router.post('/login', login);

export default router;