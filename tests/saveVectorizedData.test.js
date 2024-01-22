import saveVectorizedData from '../crawler/saveVectorizedData';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";

jest.mock('langchain/text_splitter');
jest.mock('@langchain/openai');
jest.mock('@pinecone-database/pinecone');

const mockPineconeUpsert = (mockImplementation) => {
  Pinecone.prototype.Index.mockImplementation(() => {
    return {
      upsert: mockImplementation,
    };
  });
};

describe('saveVectorizedData', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should save vectorized data to Pinecone', async () => {
    RecursiveCharacterTextSplitter.prototype.createDocuments.mockResolvedValue([
      { pageContent: 'chunk1' },
      { pageContent: 'chunk2' },
    ]);
    OpenAIEmbeddings.prototype.embedDocuments.mockResolvedValue([[1, 2], [3, 4]]);
    const mockUpsert = jest.fn();
    mockPineconeUpsert(mockUpsert);

    await saveVectorizedData('content', 'title', 'url');

    expect(RecursiveCharacterTextSplitter.prototype.createDocuments).toHaveBeenCalledWith(['content']);
    expect(OpenAIEmbeddings.prototype.embedDocuments).toHaveBeenCalledWith(['chunk1', 'chunk2']);
    expect(mockUpsert).toHaveBeenCalledWith([
      {
        id: expect.any(String),
        values: [1, 2],
        metadata: {
          title: 'title',
          url: 'url',
          pageContent: 'chunk1',
        },
      },
      {
        id: expect.any(String),
        values: [3, 4],
        metadata: {
          title: 'title',
          url: 'url',
          pageContent: 'chunk2',
        },
      },
    ]);
  });

  it('should handle vectorization failure', async () => {
    RecursiveCharacterTextSplitter.prototype.createDocuments.mockRejectedValue(new Error('Vectorization failed'));

    await expect(saveVectorizedData('content', 'title', 'url')).rejects.toThrow('Vectorization failed');
  });

  it('should handle Pinecone index update failure', async () => {
    RecursiveCharacterTextSplitter.prototype.createDocuments.mockResolvedValue([{ pageContent: 'chunk1' }]);
    OpenAIEmbeddings.prototype.embedDocuments.mockResolvedValue([[1, 2]]);

    const mockUpsertFailure = jest.fn().mockRejectedValue(new Error('Pinecone index update failed'));
    mockPineconeUpsert(mockUpsertFailure);

    await expect(saveVectorizedData('content', 'title', 'url')).rejects.toThrow('Pinecone index update failed');
  });

  it('should correctly batch vectors for Pinecone index update', async () => {
    RecursiveCharacterTextSplitter.prototype.createDocuments.mockResolvedValue([
      { pageContent: 'chunk1' },
      { pageContent: 'chunk2' },
      { pageContent: 'chunk3' },
    ]);
    OpenAIEmbeddings.prototype.embedDocuments.mockResolvedValue([[1, 2], [3, 4], [5, 6]]);
    const mockUpsert = jest.fn();
    mockPineconeUpsert(mockUpsert);

    await saveVectorizedData('content', 'title', 'url');

    expect(mockUpsert).toHaveBeenCalledWith(expect.arrayContaining([
      {
        id: expect.any(String),
        values: expect.arrayContaining([1, 2]),
        metadata: expect.objectContaining({
          title: 'title',
          url: 'url',
          pageContent: 'chunk1',
        }),
      },
      {
        id: expect.any(String),
        values: expect.arrayContaining([3, 4]),
        metadata: expect.objectContaining({
          title: 'title',
          url: 'url',
          pageContent: 'chunk2',
        }),
      },
      {
        id: expect.any(String),
        values: expect.arrayContaining([5, 6]),
        metadata: expect.objectContaining({
          title: 'title',
          url: 'url',
          pageContent: 'chunk3',
        }),
      },
    ]));
  });
});
