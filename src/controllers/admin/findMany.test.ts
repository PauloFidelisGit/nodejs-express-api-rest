import { describe, test, expect, assert } from 'vitest';
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

  test('it shoud findMany', async function () {
    const { status, body } = await request.post(`${URL}/findMany`).set('Authorization', adminToken);
    assert(status === 200, stringifyResponse({ status, body }));
    expect(body.data).length.greaterThan(0);
  });
});
