import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';

describe('API tests', () => {
  let app: INestApplication;
  let currentTimestamp;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    currentTimestamp = Date.now();

    app = moduleFixture.createNestApplication();

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('001 - should return the profile of an authenticated user', async () => {
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

  it('002 - should fail if username is empty', async () => {
    const mockCreateUserRequest = {
      username: ``,
      password: 'test',
      name: 'test',
      address: {
        street: 'test_street',
        cityId: 1,
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('003 - should fail if username is missing', async () => {
    const mockCreateUserRequest = {
      password: 'test',
      name: 'test',
      address: {
        street: 'test_street',
        cityId: 1,
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('004 - should fail if password is empty', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      password: '',
      name: 'test',
      address: {
        street: 'test_street',
        cityId: 1,
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('005 - should fail if password is missing', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      name: 'test',
      address: {
        street: 'test_street',
        cityId: 1,
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('006 - should fail if name is empty', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      password: 'test',
      name: '',
      address: {
        street: 'test_street',
        cityId: 1,
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('007 - should fail if name is missing', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      password: 'test',
      address: {
        street: 'test_street',
        cityId: 1,
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('008 - should fail if address is empty', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      password: 'test',
      name: '',
      address: {},
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('009 - should fail if address is missing', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      password: 'test',
      name: '',
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('010 - should fail if street is empty', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      password: 'test',
      name: 'test',
      address: {
        street: '',
        cityId: 1,
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('011 - should fail if street is missing', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      password: 'test',
      address: {
        cityId: 1,
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('012 - should fail if cityId is not a number', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      password: 'test',
      name: 'test',
      address: {
        street: 'test',
        cityId: '1',
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('013 - should fail if cityId is missing', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      password: 'test',
      name: 'test',
      address: {
        street: 'test',
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(400);
  });

  it('014 - should fail is the username is taken', async () => {
    const mockCreateUserRequest = {
      username: `test${currentTimestamp}`,
      password: 'test',
      name: 'test',
      address: {
        street: 'test',
        cityId: 1,
      },
    };

    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(createUserResponse.statusCode).toBe(201);

    const repeatUsernameResponse = await request(app.getHttpServer())
      .post('/user')
      .send(mockCreateUserRequest);

    expect(repeatUsernameResponse.statusCode).toBe(400);
  });
});
