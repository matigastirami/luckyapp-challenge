import { Test, TestingModule } from '@nestjs/testing';
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
    await app.init();
  });

  it('/tasks (GET)', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body).toBeDefined();
        expect(Array.isArray(body)).toBeTruthy();
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              uuid: expect.any(String),
              title: expect.any(String),
              status: expect.any(String),
            }),
          ]),
        );
      });
  });

  it('/tasks (PUT)', () => {
    const uuid = '9994d43b-efe6-4d80-882f-6429d9ee66d2';
    return request(app.getHttpServer())
      .put(`/tasks/${uuid}`)
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body).toBeDefined();
        expect(body).toHaveProperty('msg');
        expect(body.msg).toBe(
          'Task status for uuid 9994d43b-efe6-4d80-882f-6429d9ee66d2 sucessfully updated',
        );
      });
  });

  it('/tasks (PUT) with invalid uuid', () => {
    const uuid = 'invalid-string';
    return request(app.getHttpServer())
      .put(`/tasks/${uuid}`)
      .expect(400)
      .expect((res) => {
        const body = res.body;
        expect(body).toBeDefined();
        expect(body).toHaveProperty('message');
        expect(body.message).toBe('Invalid UUID');
      });
  });
});
