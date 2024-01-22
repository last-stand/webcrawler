import express from "express";
import handleWebCrawling from "../handlers/webCrawlerHandler.js";

const crawlerRouter = express.Router();

 crawlerRouter.post('/', async (req, res) => {
    const url = req.body.url;
    try {
        await handleWebCrawling(url);
        res.send({data: { text: "Web Crawling succeeded."} });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
})

export default crawlerRouter;