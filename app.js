import express, { json, urlencoded } from "express";
import dotenv from "dotenv";

const app = express();

import adminRoutes from "./routers/adminRoutes.js";
import companyRoutes from "./routers/companyRoutes.js";
import superAdminRoutes from "./routers/superAdminRoutes.js";
import { checkAuth} from "./middleware/authMiddleware.js"


if(process.env.NODE_ENV!=='production'){
  dotenv.config();
}


app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/main/',companyRoutes);

app.use('/api/' ,checkAuth,adminRoutes);

app.use('/super-admin/' ,superAdminRoutes);

const port =process.env.PORT||8000;

app.get('/', (req, res) => {
  res.send('Welcome to HManager.. Contact on <a href="https://www.teamhaash.com" style="text-decoration: none; color: inherit;">teamhaash.com</a> for enquiries.');
});

app.listen(port, () => {
  console.log("\x1b[1;31;47m%s\x1b[0m",'Server Listening on Port:', port);
});


