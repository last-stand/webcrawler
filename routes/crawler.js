import express from "express";
import handleWebCrawling from "../handlers/webCrawlerHandler.js";
import { APP_NAME } from "../constants.js";

const crawlerRouter = express.Router();

 crawlerRouter.post('/', async (req, res) => {
    const url = req.body.url;
    try {
        await handleWebCrawling(url);
    } catch(error) {
        console.log(error);
        res.render('index', { data: { title: APP_NAME, error: "Something went wrong!"} });
    }
})

export default crawlerRouter;