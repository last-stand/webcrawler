import processQuery from "../crawler/query.js";

async function handleQuery(query) {
    return await processQuery(query);
}

export default handleQuery;