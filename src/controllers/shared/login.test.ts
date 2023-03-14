import { describe, test, assert } from "vitest";
import supertest from "supertest";
import app from "../../app";
import { useForTest } from "../../hooks";

const { stringifyResponse, basePath, adminToken } = useForTest();

const request = supertest(app);

const URL = `${basePath}/shared`;

test("it shoud admin login", async function () {
  const { status, body } = await request
    .post(`${URL}/login`)
    .send({
      EMAIL: `admin@email.com`,
      SENHA: "123456",
      TIPO_USUARIO: "administrador",
    })
    .set("Authorization", adminToken);
  assert(status === 200, stringifyResponse({ status, body }));
});

test("it shoud user login", async function () {
  const { status, body } = await request
    .post(`${URL}/login`)
    .send({
      EMAIL: `usuario@email.com`,
      SENHA: "123456",
      TIPO_USUARIO: "usuario",
    })
    .set("Authorization", adminToken);
  assert(status === 200, stringifyResponse({ status, body }));
});
