import handleWebCrawling from '../../handlers/webCrawlerHandler';
import crawl from '../../crawler/webCrawler';
import saveVectorizedData from '../../crawler/saveVectorizedData';

jest.mock('../../crawler/webCrawler');
jest.mock('../../crawler/saveVectorizedData');

describe('handleWebCrawling', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle web crawling and save vectorized data', async () => {
    const mockCrawlResult = {
      title: 'Mock Title',
      content: 'Mock Content',
    };
    crawl.mockResolvedValueOnce(mockCrawlResult);

    const url = 'https://example.com';
    await handleWebCrawling(url);

    expect(crawl).toHaveBeenCalledWith(url);
    expect(saveVectorizedData).toHaveBeenCalledWith(mockCrawlResult.content, mockCrawlResult.title, url);
  });
});
