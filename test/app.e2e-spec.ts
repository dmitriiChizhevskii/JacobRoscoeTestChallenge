import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/todos (POST) 200', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ task: 'todo1' })
      .expect(200)
      .expect({ "success": true });
  });

  it('/todos (POST) 400', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ foo: 'bar' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: [ 'task must be a string', 'task should not be empty' ],
        error: 'Bad Request'
      });
  });

  it('/todos/:id (PATCH) 404', () => {
    return request(app.getHttpServer())
      .post('/todos/-1')
      .send({ updated: true })
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Cannot POST /todos/-1',
        error: 'Not Found'
      });
  });

  it('/subscribe (POST) 400', async () => {
    return request(app.getHttpServer())
      .post('/subscribe')
      .send({ url: 'todo1' })
      .expect(400)
      .expect({
        statusCode: 400,
        message: [ 'Url is not valid.' ],
        error: 'Bad Request'
      });
  });

  it('/subscribe (POST) 200', async () => {
    return request(app.getHttpServer())
      .post('/subscribe')
      .send({ url: 'www.foo.bar' })
      .expect(200)
      .expect({ "success": true });
  });
});
