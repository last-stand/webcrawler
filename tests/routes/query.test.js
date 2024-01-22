import express from 'express';
import supertest from 'supertest';
import queryRouter from '../../routes/query';
import handleQuery from '../../handlers/queryHandler';

jest.mock('../../handlers/queryHandler');

const app = express();
app.use(express.json());
app.use('/query', queryRouter);

describe('Query Router', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('handles successful query processing', async () => {
    const mockAnswer = 'Mocked Answer';
    handleQuery.mockResolvedValueOnce(mockAnswer);

    const response = await supertest(app)
      .post('/query')
      .send({ query: 'What is the answer?' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: mockAnswer });
    expect(handleQuery).toHaveBeenCalledWith('What is the answer?');
  });

  it('handles query processing failure', async () => {
    const mockError = new Error('Query Processing Error');
    handleQuery.mockRejectedValueOnce(mockError);

    const response = await supertest(app)
      .post('/query')
      .send({ query: 'What is the answer?' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Query Processing Error' });
    expect(handleQuery).toHaveBeenCalledWith('What is the answer?');
  });
});
