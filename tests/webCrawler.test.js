import puppeteer from "puppeteer";
import crawl from "../crawler/webCrawler";
jest.mock('puppeteer');
  
describe('Crawl Web Page', () => {
  let mockPage;
  let mockBrowser;

  beforeEach(() => {
    const mockPageTitle = 'Mock Page Title';
    const mockPageContent = '<div>Mock page content<div>';
    mockPage = {
      goto: jest.fn().mockResolvedValue(),
      title: jest.fn().mockResolvedValue(mockPageTitle),
      $eval: jest.fn().mockResolvedValue(mockPageContent),
      close: jest.fn().mockResolvedValue(),
    };

    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(),
    };

    puppeteer.launch.mockResolvedValue(mockBrowser);
  });

  it('should successfully crawl a page', async () => {
    const url = 'http://example.com';
    const result = await crawl(url);

    expect(result).toEqual({
      title: 'Mock Page Title',
      url,
      content: '<div>Mock page content<div>',
    });
  });

  it('should call page.goto with the correct arguments', async () => {
    const url = 'http://example.com';
    await crawl(url);

    expect(mockPage.goto).toHaveBeenCalledWith(url, { waitUntil: 'networkidle2' });
    expect(mockPage.goto).toHaveBeenCalledTimes(1);
  });

  it('should retrieve the page title', async () => {
    const url = 'http://example.com';
    const result = await crawl(url);

    expect(result.title).toBe('Mock Page Title');
  });

  it('should retrieve the page content', async () => {
    const url = 'http://example.com';
    const result = await crawl(url);

    expect(result.content).toEqual('<div>Mock page content<div>');
  });

  it('should handle URLs with spaces and trim them', async () => {
    const url = ' http://example.com ';
    await crawl(url);

    expect(mockPage.goto).toHaveBeenCalledWith('http://example.com', { waitUntil: 'networkidle2' });
  });

  it('should handle errors during page.goto', async () => {
    mockPage.goto.mockRejectedValue(new Error('Failed to navigate'));

    const url = 'http://example.com';
    await expect(crawl(url)).rejects.toThrowError('Failed to navigate');
  });
});