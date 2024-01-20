import { Pinecone } from "@pinecone-database/pinecone";

async function initialisePinecone() {
    const pinecone = new Pinecone();
    const indexes = await pinecone.listIndexes();
    const name = process.env.PINECONE_INDEX;
    const isIndexPreset = indexes.some((index) => index.name === "web-crawler")
    if (!isIndexPreset) {
        await createPineconeIndex(pinecone, name)
        console.log(`Pinecone index ${name} is created`);
    }
}

async function createPineconeIndex(pinecone, name) {
    await pinecone.createIndex({
        name: name,
        dimension: 1536,
        metric: 'cosine',
        pods: 1,
        podType: 'starter',
        waitUntilReady: true
    });
}

export default initialisePinecone;

