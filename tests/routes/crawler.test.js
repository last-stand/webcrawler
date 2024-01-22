import express from 'express';
import supertest from 'supertest';
import crawlerRouter from '../../routes/crawler';
import handleWebCrawling from '../../handlers/webCrawlerHandler';

jest.mock('../../handlers/webCrawlerHandler');

const app = express();
app.use(express.json());
app.use('/crawl', crawlerRouter);

describe('Crawler Router', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('handles successful web crawling', async () => {
    handleWebCrawling.mockResolvedValueOnce();

    const response = await supertest(app)
      .post('/crawl')
      .send({ url: 'https://example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { text: 'Web Crawling succeeded.' } });
    expect(handleWebCrawling).toHaveBeenCalledWith('https://example.com');
  });

  it('handles web crawling failure', async () => {
    const mockError = new Error('Web Crawling Error');
    handleWebCrawling.mockRejectedValueOnce(mockError);

    const response = await supertest(app)
      .post('/crawl')
      .send({ url: 'https://example.com' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Web Crawling Error' });
    expect(handleWebCrawling).toHaveBeenCalledWith('https://example.com');
  });
});
