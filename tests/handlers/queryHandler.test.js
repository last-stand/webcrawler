import handleQuery from '../../handlers/queryHandler';
import processQuery from '../../crawler/query';

jest.mock('../../crawler/query');

describe('handleQuery', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle the query using processQuery', async () => {
    const mockResult = 'Mocked Result';
    processQuery.mockResolvedValueOnce(mockResult);

    const query = 'Test query';
    const result = await handleQuery(query);

    expect(processQuery).toHaveBeenCalledWith(query);
    expect(result).toBe(mockResult);
  });
});
