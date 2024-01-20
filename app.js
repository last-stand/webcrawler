import express from "express";
import dotenv from "dotenv";
import logger from "morgan";
import path from "path";
import indexRouter from "./routes/index.js";
import crawlerRouter from "./routes/crawler.js";
import initialisePinecone from "./crawler/initialisePinecone.js";
import queryRouter from "./routes/query.js";

dotenv.config();
const PORT = process.env.PORT || 8001;
const ENV =  process.env.ENV || 'dev';

initialisePinecone();
const app = express();

app.set('views', path.dirname('views'));
app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(logger(ENV));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve('./public')));
app.use('/', indexRouter);
app.use('/crawl', crawlerRouter);
app.use('/query', queryRouter);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));