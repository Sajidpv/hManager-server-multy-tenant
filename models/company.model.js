import {Schema,  model } from "mongoose";
import bcrypt from 'bcrypt';
import {connect} from "../config/db.js"
let db;



const companySchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    financialYear: {
        type: Date,
        required: true,
    },
    gstNo: {
        type: String,
        unique:true,
    },
    panNo: {
        type: String,

    },
    addressLine1: {
        type: String,
        required: true,
    }, 
    addressLine2: {
        type: String,

    },
    country: {
        type: String,
        required: true,
    }, 
    state: {
        type: String,
        required: true,
    }, 
    zip: {
        type: Number,
        required: true,
    }, 
    mobile: {
        type: String,

    }, 
    email: {
        type: String,
        required: true, 
        unique:true,
    }, 
    password: {
        type: String,
        required: true,
     },
    userType: {
        type: String,
        required: true,
     }, 
     payment: {
        type: String,
        required: true,
        default:'Pending'
     }, 
     accDetails: {
        bank: {
           type: String,
  
        },
        ifsc: {
           type: String,
  
        },
        accNo: {
           type: Number,
  
        },
     },
    status: { type: String, required: true }
},{timestamps:true});




companySchema.pre('save', async function (next) {
    try {
        var company = this;
        const salt = await (bcrypt.genSalt(10));
        const hashpass = await bcrypt.hash(company.password, salt);
  
        company.password = hashpass;
        next();
     } catch (error) {
        throw error;
     }
 
 });
 
 companySchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function(next) {
 
    const update = this.getUpdate();
    delete update._id;

    next();
 });
 companySchema.methods.comparePassword = async function (userPassword) {
    try {
       const isMatched = await bcrypt.compare(userPassword, this.password);
       return isMatched;
    } catch (error) {
       throw error;
    }
 }

 
 const companyModel=model('company-details', companySchema);
 
const getDb=async()=>{
    return db?db:await connect(process.env.BASE_DB_URL+process.env.DB_NAME)
}

const getCompanyModel=async()=>{
    const masterDb=await getDb();
    return masterDb.model('company-details', companySchema);
}

export default getCompanyModel

