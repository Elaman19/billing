import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { AccountService } from 'src/account/account.service';

describe('Billing', () => {
  let app: INestApplication;
  let accountService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AccountModule],
    })
      .overrideProvider(AccountService)
      .useValue(accountService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET users`, () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect({
        data: accountService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});