import { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { getCompanyDb } from "../config/db.js"
import getGodownModel from "../models/godown.model.js";

const userSchema = new Schema({
   email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true
   },

   gender: {
      type: String,
      required: true,
   },
   mobile: {
      type: String,

   },
   jobType: {
      type: String,
      required: true,
   },
   salary: {
      amount: {
         type: Number,
         default: 0

      }, hours: {
         type: Number,
         default: 0

      }, days: {
         type: Number,
         default: 0

      },
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
      panNo: {
         type: String,

      },
   },
   resourcePermissions: [{
      resource: {
         type: String,
         required: true,
      },
      permissions: {
         type: Map,
         of: Boolean,
         required: true,
         default: {},
      },
   }],
   godownAccess: [
      {
         type: Schema.Types.ObjectId,
         ref: getGodownModel,
         required: true,
      }],

   password: {
      type: String,
      required: true,
   },
   empID: {
      type: String,
      unique: true
   },
   name: {
      type: String,
      required: true,
   },
   userType: {
      type: String,
      required: true,
   },
   companyId: {
      type: Schema.Types.ObjectId,
      ref: 'company-details',
      required: true
   },
   status: { type: String, required: true }
}, { timestamps: true });


userSchema.pre('save', async function (next) {
   this.updatedOn = new Date();
   this.createdOn = new Date();
   try {
      var user = this;
      const salt = await (bcrypt.genSalt(10));
      const hashpass = await bcrypt.hash(user.password, salt);

      user.password = hashpass;
      next();
   } catch (error) {
      throw error;
   }
});
userSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function (next) {
   const update = this.getUpdate();
   delete update._id;
   this.updatedOn = new Date();

   next();
});




userSchema.methods.comparePassword = async function (userPassword) {
   try {
      const isMatched = await bcrypt.compare(userPassword, this.password);
      return isMatched;
   } catch (error) {
      throw error;
   }
}

userSchema.methods.setDefaultPermissions = async function (companyId) {
   const defaultPermissions = getDefaultPermissions(this.userType);
   try {
      const godownAccessPermissions = await getDefaultGodownAccessPermissions(this.userType, companyId);

      this.resourcePermissions = defaultPermissions;
      this.godownAccess = godownAccessPermissions;
   } catch (error) {
      console.error('Error setting default permissions:', error);
   }
};



async function getDefaultGodownAccessPermissions(userType, companyId) {
   let godownModel = await getGodownModel(companyId);
   if (userType === 'Admin' || userType === 'Owner') {

      return godownModel.find({}, '_id')
         .then(godowns => {
            return godowns.map(godown => godown._id);
         })
         .catch(error => {
            console.error('Error retrieving godowns:', error);
            return [];
         });
   } else {
      return godownModel.findOne({ isPrimary: true }, '_id')
         .then(primaryGodown => {
            return primaryGodown ? [primaryGodown._id] : [];
         })
         .catch(error => {
            console.error('Error retrieving primary godown:', error);
            return [];
         });

   }
}

function getDefaultPermissions(userType) {
   const commonPermissions = { READ: true, WRITE: true, EDIT: true, DELETE: true };
   const customResources = ['user', 'suppliers', 'colors', 'stock', 'sales', 'material-purchase', 'orders', 'stock-categories', 'sizes',
      'inventory-db', 'godowns', 'tailer-docs', 'sales-estimates', 'finisher-docs', 'finish-cutter', 'assign-cutter', 'company-details'];
   switch (userType) {
      case 'Owner':
      case 'Admin':
         return getDefaultCommonPermissions(commonPermissions, customResources);

      case 'Production Admin':
         return [
            { resource: 'user', permissions: { READ: true, EDIT: true, } },
            { resource: 'stock', permissions: { READ: true, EDIT: true, } },
            { resource: 'stock-categories', permissions: { READ: true, } },
            { resource: 'colors', permissions: { READ: true, WRITE: true } },
            { resource: 'sizes', permissions: { READ: true, WRITE: true, EDIT: true, } },
            { resource: 'orders', permissions: { READ: true, WRITE: true, EDIT: true, } },
            { resource: 'godowns', permissions: { READ: true, } },
            ...getDefaultCommonPermissions(commonPermissions, [
               'tailer-docs', 'finisher-docs',
               'finish-cutter', 'assign-cutter'
            ])
         ];

      case 'Purchaser Admin':
         return [
            { resource: 'user', permissions: { READ: true, EDIT: true, } },
            { resource: 'stock', permissions: { READ: true, WRITE: true, EDIT: true, } },
            { resource: 'stock-categories', permissions: { READ: true, WRITE: true, EDIT: true, } },
            { resource: 'sizes', permissions: { READ: true, WRITE: true, } },
            { resource: 'colors', permissions: { READ: true, WRITE: true } },
            { resource: 'inventory-db', permissions: { READ: true, WRITE: true, } },
            { resource: 'godowns', permissions: { READ: true, } },
            { resource: 'company-details', permissions: { READ: true, } },
            ...getDefaultCommonPermissions(commonPermissions, ['orders', 'material-purchase', 'suppliers'])
         ];
      case 'Sales Admin':
         return [
            { resource: 'user', permissions: { READ: true, EDIT: true, } },
            { resource: 'stock', permissions: { READ: true, WRITE: true, EDIT: true, } },
            { resource: 'stock-categories', permissions: { READ: true, } },
            { resource: 'colors', permissions: { READ: true } },
            { resource: 'sizes', permissions: { READ: true, } },
            { resource: 'inventory-db', permissions: { READ: true, WRITE: true, } },
            { resource: 'godowns', permissions: { READ: true, } },
            { resource: 'company-details', permissions: { READ: true, } },
            ...getDefaultCommonPermissions(commonPermissions, ['orders', 'sales', 'sales-estimates', 'suppliers'])
         ];
      case 'Accountant Admin':
         return [
            { resource: 'user', permissions: { READ: true, EDIT: true, } },
            { resource: 'sales', permissions: { READ: true, } },
            { resource: 'material-purchase', permissions: { READ: true, } },
            { resource: 'colors', permissions: { READ: true } },
            { resource: 'inventory-db', permissions: { READ: true, } },
            { resource: 'godowns', permissions: { READ: true, } },
            { resource: 'company-details', permissions: { READ: true, } },

         ]; case 'Cutter':
         return [
            { resource: 'user', permissions: { READ: true, EDIT: true, } },
            { resource: 'stock', permissions: { READ: true, EDIT: true, } },
            { resource: 'sizes', permissions: { READ: true, } },
            { resource: 'stock-categories', permissions: { READ: true, } },
            { resource: 'inventory-db', permissions: { READ: true, WRITE: true, } },
            { resource: 'finish-cutter', permissions: { READ: true, WRITE: true, } },
            { resource: 'assign-cutter', permissions: { READ: true, EDIT: true, } },
            { resource: 'company-details', permissions: { READ: true, } },
         ]; case 'Tailer':
         return [
            { resource: 'user', permissions: { READ: true, EDIT: true, } },
            { resource: 'tailer-docs', permissions: { READ: true, WRITE: true,EDIT: true, } },
            { resource: 'inventory-db', permissions: { READ: true, WRITE: true, } },
            { resource: 'finish-cutter', permissions: { READ: true, } },
            { resource: 'company-details', permissions: { READ: true, } },
         ]; case 'Finisher':
         return [
            { resource: 'user', permissions: { READ: true, EDIT: true, } },
            { resource: 'tailer-docs', permissions: { READ: true, } },
            { resource: 'inventory-db', permissions: { READ: true, WRITE: true, } },
            { resource: 'godowns', permissions: { READ: true, } },
            { resource: 'stock', permissions: { READ: true, WRITE: true, EDIT: true, } },
            { resource: 'finisher-docs', permissions: { READ: true, EDIT: true,WRITE: true, } },
            { resource: 'company-details', permissions: { READ: true, } },
         ];
      default:
         return [];
   }
}

function getDefaultCommonPermissions(permissions, resources) {
   return resources.map(resource => ({ resource, permissions }));
}



const getUserModel = async (companyId) => {
   const companyDb = await getCompanyDb(companyId);
   return companyDb.model('user', userSchema)
}

export default getUserModel
