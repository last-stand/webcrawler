import initialisePinecone from '../crawler/initialisePinecone';
import { Pinecone } from '@pinecone-database/pinecone';

jest.mock('@pinecone-database/pinecone');

describe('Initialise Pinecone', () => {
    let mockPinecone;
    let mockListIndexes;
    let mockCreateIndex;
  
    beforeEach(() => {
      mockListIndexes = jest.fn().mockResolvedValue([]);
      mockCreateIndex = jest.fn().mockResolvedValue();
      mockPinecone = {
        listIndexes: mockListIndexes,
        createIndex: mockCreateIndex,
      };
      Pinecone.mockReturnValue(mockPinecone);
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    it('should create a Pinecone index if it does not exist', async () => {
      const mockIndexName = 'web-crawler';
      process.env.PINECONE_INDEX = mockIndexName;
  
      await initialisePinecone();
  
      expect(mockListIndexes).toHaveBeenCalledTimes(1);
      expect(mockCreateIndex).toHaveBeenCalledTimes(1);
      expect(mockCreateIndex).toHaveBeenCalledWith({
        name: mockIndexName,
        dimension: 1536,
        metric: 'cosine',
        pods: 1,
        podType: 'starter',
        waitUntilReady: true,
      });
      expect(console.log).toHaveBeenCalledWith(`Pinecone index ${mockIndexName} is created`);
    });
  
    it('should not create a Pinecone index if it already exists', async () => {
      const mockIndexName = 'web-crawler';
      process.env.PINECONE_INDEX = mockIndexName;
      // Simulate an existing index
      mockListIndexes.mockResolvedValue([{ name: mockIndexName }]);
  
      await initialisePinecone();
  
      expect(mockListIndexes).toHaveBeenCalledTimes(1);
      expect(mockCreateIndex).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });
  
    it('should handle Pinecone errors during listIndexes', async () => {
      const mockError = new Error('Pinecone error');
      mockListIndexes.mockRejectedValue(mockError);
  
      await expect(initialisePinecone()).rejects.toThrowError(mockError);
  
      expect(mockListIndexes).toHaveBeenCalledTimes(1);
      expect(mockCreateIndex).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });
  
    it('should handle Pinecone errors during createIndex', async () => {
      const mockError = new Error('Pinecone error');
      mockCreateIndex.mockRejectedValue(mockError);
  
      await expect(initialisePinecone()).rejects.toThrowError(mockError);
  
      expect(mockListIndexes).toHaveBeenCalledTimes(1);
      expect(mockCreateIndex).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
    });
});