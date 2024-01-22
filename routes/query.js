import express from "express";
import handleQuery from "../handlers/queryHandler.js";
import { APP_NAME } from "../constants.js";

const queryRouter = express.Router();

 queryRouter.post('/', async (req, res) => {
    try {
        const query = req.body.query;
        const answer = await handleQuery(query);
        res.send({ data: answer });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
})

export default queryRouter;