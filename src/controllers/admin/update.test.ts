import bcrypt from 'bcrypt';
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

  test('it shoud update', async function () {
    const { status, body } = await request
      .put(`${URL}/update`)
      .send({
        ID,
        REGISTRO_ATIVO: true,
        NOME: 'Nome',
        EMAIL: `admin_${random()}@email.com`,
        ATUALIZADO_EM: '2022-11-11T14:34:35.083Z',
      })
      .set('Authorization', adminToken);
    assert(status === 200, stringifyResponse({ status, body }));
  });

  test('it shoud update password', async function () {
    const { status, body } = await request
      .put(`${URL}/updatePassword`)
      .send({
        ID,
        SENHA_ATUAL: '123456',
        NOVA_SENHA: '123456',
        REPITA_NOVA_SENHA: '123456',
        ATUALIZADO_EM: '2022-11-11T14:34:35.083Z',
      })
      .set('Authorization', adminToken);
    assert(status === 200, stringifyResponse({ status, body }));
  });

  test('shoud not update password', async function () {
    const { status, body } = await request
      .put(`${URL}/updatePassword`)
      .send({
        ID,
        SENHA_ATUAL: '123456789',
        NOVA_SENHA: '123456',
        REPITA_NOVA_SENHA: '123456',
        ATUALIZADO_EM: '2022-11-11T14:34:35.083Z',
      })
      .set('Authorization', adminToken);
    assert(status === 400, stringifyResponse({ status, body }));
  });
});
