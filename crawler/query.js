import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from '@langchain/core/documents'

async function processQuery(query) {
    console.log("Querying Pinecone vector store...");
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(query);

    let queryResponse = await pineconeIndex.query({
        topK: 3,
        vector: queryEmbedding,
        includeValues: true,
        includeMetadata: true,
    })
    console.log(`Found ${queryResponse.matches.length} matches`);

    console.log(queryResponse);

    if (queryResponse.matches.length) {
        return askQuestion(queryResponse, query);
    }
    return "No relevent information found."
}

async function askQuestion(queryResponse, query) {
    const llm = new OpenAI({});
    const chain = loadQAStuffChain(llm);
    const concatenatedPageContent = queryResponse.matches
        .map((match) => match.metadata.pageContent)
        .join(" ");
    const result = await chain.invoke({
        input_documents: [new Document({ pageContent: concatenatedPageContent })],
        question: query,
    });

    console.log(`Answer: ${result.text}`);
    return result;
}

export default processQuery;

