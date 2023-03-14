import { describe, test, assert } from "vitest";
import supertest from "supertest";
import app from "../../app";
import { useForTest } from "../../hooks";

const { stringifyResponse, basePath, adminToken } = useForTest();

const request = supertest(app);

const URL = `${basePath}/shared`;

test("it shoud find user by token", async function () {
  const { status, body } = await request.get(`${URL}/findUserByToken`).set("Authorization", adminToken);
  assert(status === 200, stringifyResponse({ status, body }));
});
