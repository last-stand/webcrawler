import express from "express";
import { APP_NAME } from "../constants.js";

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
    res.render('index', { data: { title: APP_NAME } });
})

export default indexRouter;