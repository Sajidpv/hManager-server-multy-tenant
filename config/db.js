import mongoose from 'mongoose';
let db;

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
};

const connect = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await mongoose.createConnection(url, mongoOptions).asPromise();
            resolve(connection);
        } catch (error) {
            reject(error);
        }
    });
};

const getCompanyDb=async(companyId)=>{
    const dbName=`company_${companyId}`;
    db=db?db:await connect(process.env.BASE_DB_URL)
    let companydb=db.useDb(dbName,{useCache:true});
    return companydb;
 }

export { connect,getCompanyDb };









