import express from "express";
import { APP_NAME } from "../constants.js";

const indexRouter = express.Router();

indexRouter.get('/', (req, res) => {
    // try {
        res.render('index', { data: { title: APP_NAME } });
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).send(error.message);
    // }
})

export default indexRouter;