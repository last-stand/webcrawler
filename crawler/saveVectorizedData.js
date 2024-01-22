import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Pinecone } from "@pinecone-database/pinecone";

async function saveVectorizedData(content, title, url) {
  const pinecone = new Pinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
  });
  console.log("Splitting text into chunks...");
  const chunks = await textSplitter.createDocuments([content]);

  console.log(`Creating OpenAI Embeddings with ${chunks.length} text chunks...`);
  const embeddings = await new OpenAIEmbeddings().embedDocuments(
    chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
  )
  console.log("Finished embeddings creation");
  console.log(`Creating ${chunks.length} vectors array with id, values, and metadata...`);
  await upsertChunksToPinecone(chunks, title, embeddings, url, pineconeIndex);
}

async function upsertChunksToPinecone(chunks, title, embeddings, url, pineconeIndex) {
  const batchSize = 100;
  let batch = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const id = `${title}_${Date.now()}_${i}`;
    const vector = {
      id,
      values: embeddings[i],
      metadata: {
        title,
        url,
        pageContent: chunk.pageContent,
      }
    };
    batch.push(vector);
    if (batch.length === batchSize || i === chunks.length - 1) {
      await pineconeIndex.upsert(batch);
      batch = [];
    }

    console.log(`Pinecone index updated with vectors`);
  }
}

export default saveVectorizedData;
