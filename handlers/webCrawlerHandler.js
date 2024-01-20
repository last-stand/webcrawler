import saveVectorizedData from "../crawler/saveVectorizedData.js";
import crawl from "../crawler/webCrawler.js";

export default async function handleWebCrawling(url) {
    const { title, content } = await crawl(url);
    await saveVectorizedData(content, title);
}