import processQuery from '../../crawler/query';
import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";

jest.mock("@pinecone-database/pinecone");
jest.mock("@langchain/openai");
jest.mock('langchain/chains', () => ({
  loadQAStuffChain: jest.fn(() => ({
    invoke: jest.fn().mockResolvedValue({ text: 'Test Answer' })
  }))
}));
jest.mock('@langchain/core/documents');

describe('processQuery', () => {
  beforeEach(() => jest.spyOn(console, 'log').mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it('should return "No relevant information found" when no matches are found', async () => {
    const pineconeIndexMock = { query: jest.fn().mockResolvedValue({ matches: [] }) };
    jest.spyOn(Pinecone.prototype, 'Index').mockReturnValueOnce(pineconeIndexMock);
    jest.spyOn(OpenAIEmbeddings.prototype, 'embedQuery').mockResolvedValueOnce('mockedEmbedding');

    const result = await processQuery('test query');
    expect(result).toBe('No relevent information found.');
  });

  it('should call askQuestion when matches are found', async () => {
    const query = 'What is the answer?';
    const pineconeIndexMock = { query: jest.fn().mockResolvedValue({ matches: [{ metadata: { pageContent: 'Test Page Content' } }] }) };
    jest.spyOn(Pinecone.prototype, 'Index').mockReturnValueOnce(pineconeIndexMock);
    jest.spyOn(OpenAIEmbeddings.prototype, 'embedQuery').mockResolvedValueOnce('test_embedding');

    const result = await processQuery(query);

    expect(result).toEqual({ text: 'Test Answer' });
    expect(console.log).toHaveBeenCalledWith('Querying Pinecone vector store...');
    expect(console.log).toHaveBeenCalledWith('Found 1 matches');
    expect(console.log).toHaveBeenCalledWith('Answer: Test Answer');
  });

  it('should handle errors during embedding generation', async () => {
    jest.spyOn(OpenAIEmbeddings.prototype, 'embedQuery').mockRejectedValueOnce(new Error('Embedding error'));

    await expect(processQuery('test query')).rejects.toThrow('Embedding error');
  });

  it('should handle errors during Pinecone query', async () => {
    jest.spyOn(Pinecone.prototype, 'Index').mockReturnValueOnce({ query: jest.fn().mockRejectedValue(new Error('Pinecone error')) });

    await expect(processQuery('test query')).rejects.toThrow('Pinecone error');
  });
});
