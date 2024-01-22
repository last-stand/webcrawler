import express from 'express';
import supertest from 'supertest';
import path from 'path';
import indexRouter from '../../routes/index';
import { APP_NAME } from '../../constants';

const app = express();
app.set('views', path.resolve('views'));
app.set('view engine', 'ejs');
app.use(indexRouter);

describe('Index Router', () => {
  it('renders the index view with the correct data', async () => {
    const response = await supertest(app)
      .get('/')
      .expect(200);

    expect(response.text).toContain(`<title>${APP_NAME}</title>`);
  });
});
