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

  it('should return the profile of an authenticated user', async () => {
    const currentTimestamp = Date.now();

    const mockSignInRequest = {
      username: `test${currentTimestamp}`,
      password: 'test',
    };

    const mockCreateUserRequest = {
      ...mockSignInRequest,
      name: 'test',
      address: {
        street: 'test_street',
        cityId: 1,
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    const expectedGetUserResponse = {
      id: -1,
      name: 'test',
      address: {
        street: 'test_street',
        city: 'ARGENTINA_RANDOM_CITY',
        country: 'ARGENTINA',
      },
    };

    expect(createUserResponse.statusCode).toBe(201);
    expect(createUserResponse.body).toHaveProperty('id');
    expect(createUserResponse.body.id).not.toBeNull();

    expectedGetUserResponse.id = createUserResponse.body.id;

    const signInResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockSignInRequest);

    expect(signInResponse.statusCode).toBe(200);
    expect(signInResponse.body).toHaveProperty('access_token');

    const accessToken = signInResponse.body.access_token;

    const getProfileResponse = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', accessToken)
      .send();

    expect(getProfileResponse.statusCode).toBe(200);
    expect(getProfileResponse.body).toStrictEqual(expectedGetUserResponse);
  });
});
