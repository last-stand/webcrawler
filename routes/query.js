import express from "express";
import handleQuery from "../handlers/queryHandler.js";
import { APP_NAME } from "../constants.js";

const queryRouter = express.Router();

 queryRouter.post('/', async (req, res) => {
    try {
        const query = req.body.query;
        const answer = await handleQuery(query);
        res.render('index', { data: { title: APP_NAME, answer } });
    } catch(error) {
        console.log(error);
        res.render('index', { data: { title: APP_NAME, error: "Something went wrong!" } });
    }
})

export default queryRouter;