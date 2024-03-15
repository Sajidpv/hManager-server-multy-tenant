import { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import { connect } from "../config/db.js"
let db;



const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: 'Admin'
    },
    mobile: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: 'admin'
    },
    userType: {
        type: String,
        default: 'Super Admin'
    },
}, { timestamps: true });




adminSchema.pre('save', async function (next) {
    try {
        var admin = this;
        const salt = await (bcrypt.genSalt(10));
        const hashpass = await bcrypt.hash(admin.password, salt);

        admin.password = hashpass;
        next();
    } catch (error) {
        throw error;
    }

});

adminSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function (next) {

    const update = this.getUpdate();
    delete update._id;

    next();
});


adminSchema.methods.comparePassword = async function (adminPassword) {
    try {
        const isMatched = await bcrypt.compare(adminPassword, this.password);
        return isMatched;
    } catch (error) {
        throw error;
    }
}



const getDb = async () => {
    return db ? db : await connect(process.env.BASE_DB_URL + process.env.DB_NAME)
}

const getAdminModel = async () => {
    const masterDb = await getDb();
    return masterDb.model('admin-details', adminSchema);
}

export default getAdminModel

