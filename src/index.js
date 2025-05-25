import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./handler/error-handler.js";
import router from "./route/index.route.js"
import instanceMongoDB from "./config/db.config.js";
dotenv.config();
const app = express();
const port = process.env.PORT;
instanceMongoDB.connect();
app.use(express.json());
app.use(cookieParser());
router(app);
app.use(errorHandler);
app.get('/', (req, res) => {
    res.send("Nguyen Huu Nhat Huy");
})
app.listen(port, () => {
    console.log("Listening on port: ", port)
})