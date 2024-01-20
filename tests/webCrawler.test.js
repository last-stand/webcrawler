import crawl from "../crawler/webCrawler";
  

describe('Handling Dynamic Content with Puppeteer', () => {
    it('should crawl data from a given url having dynamic content', async () => {
      const url = 'https://example.com';
      
      const result = await crawl(url);
  
      expect(result.title).toBeTruthy();
      expect(result.content).toBeTruthy();
    }, 10000);
  });