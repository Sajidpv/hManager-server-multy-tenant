import { Schema } from "mongoose";
import { connect } from "../config/db.js"
let db;


const allowedPolicyTypes = ['Privacy Policy', 'Return Policy', 'Data Policy', 'Support Policy', 'Terms & Conditions'];
const policySchema = new Schema({
    policyName: {
        type: String,
        required: true,
        unique:true,
        enum:allowedPolicyTypes
    },
    description: {
        type: String,
    },
    content: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });






const getDb = async () => {
    return db ? db : await connect(process.env.BASE_DB_URL + process.env.DB_NAME)
}

const getPolicyModel = async () => {
    const masterDb = await getDb();
    return masterDb.model('policies', policySchema);
}

export default getPolicyModel

