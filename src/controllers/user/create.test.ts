import { describe, test, assert } from "vitest";
import supertest from "supertest";
import app from "../../app";
import { useForTest } from "../../hooks";

const { random, stringifyResponse, basePath, adminToken } = useForTest();

const request = supertest(app);

const URL = `${basePath}/user`;

describe("Admin: " + URL, function () {
  test("it shoud create", async function () {
    const { status, body } = await request
      .post(`${URL}/create`)
      .send({
        NOME: "Nome do usuario",
        EMAIL: `${random()}@email.com`,
        SENHA: "123456",
        REPITA_SENHA: "123456",
        CRIADO_EM: "2022-11-11T14:34:35.083Z",
      })
      .set("Authorization", adminToken);
    assert(status === 200, stringifyResponse({ status, body }));
  });
});
