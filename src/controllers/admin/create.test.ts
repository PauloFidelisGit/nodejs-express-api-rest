import { describe, test, assert } from 'vitest';
import supertest from 'supertest';
import app from '../../app';
import { useForTest } from '../../hooks';

const { random, stringifyResponse, basePath, adminToken } = useForTest();

const request = supertest(app);

const URL = `${basePath}/admin`;

describe(URL, function () {
  let ID: number;

  test('it shoud create', async function () {
    const { status, body } = await request
      .post(`${URL}/create`)
      .send({
        NOME: 'Nome',
        EMAIL: `admin_${random()}@email.com`,
        SENHA: '123456',
        CRIADO_EM: '2022-11-11T14:34:35.083Z',
      })
      .set('Authorization', adminToken);
    assert(status === 200, stringifyResponse({ status, body }));
    ID = body.data.ID;
  });

  test('shoud not create if password less than 6', async function () {
    const { status, body } = await request
      .post(`${URL}/create`)
      .send({
        NOME: 'Nome',
        EMAIL: `admin_${random()}@email.com`,
        SENHA: '12345',
        CRIADO_EM: '2022-11-11T14:34:35.083Z',
      })
      .set('Authorization', adminToken);
    assert(body.messages[0].code === 'too_small', stringifyResponse({ status, body }));
  });

  test('shoud not create if invalid date', async function () {
    const { status, body } = await request
      .post(`${URL}/create`)
      .send({
        NOME: 'Nome',
        EMAIL: `admin_${random()}@email.com`,
        SENHA: '123456',
        CRIADO_EM: '2022-11-11T14:34:',
      })
      .set('Authorization', adminToken);
    assert(body.messages[0].code === 'too_small', stringifyResponse({ status, body }));
  });

  test('shoud not create if invalid date', async function () {
    const { status, body } = await request
      .post(`${URL}/create`)
      .send({
        NOME: 'Nome',
        EMAIL: `admin_${random()}@email.com`,
        SENHA: '123456',
        CRIADO_EM: '2022-11-11T14:34:35.083A',
      })
      .set('Authorization', adminToken);
    assert(body.messages[0].code === 'invalid_string', stringifyResponse({ status, body }));
  });

  test('it shoud create', async function () {
    const { status, body } = await request
      .post(`${URL}/create`)
      .send({
        NOME: 'Nome',
        EMAIL: `admin_${random()}@email.com`,
        SENHA: '123456',
        CRIADO_EM: '2022-11-11T14:34:35.083Z',
      })
      .set('Authorization', adminToken);
    assert(status === 200, stringifyResponse({ status, body }));
  });
});
