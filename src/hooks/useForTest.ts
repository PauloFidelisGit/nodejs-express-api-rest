import { envolvirements } from "../config";
import { uuid } from "uuidv4";

export default function useForTest() {
  const { API_ADMIN_TOKEN, API_BASE_PATCH, API_USER_TOKEN } = envolvirements;
  return {
    get adminToken() {
      return `Bearer ${API_ADMIN_TOKEN}`;
    },
    get userToken() {
      return `Bearer ${API_USER_TOKEN}`;
    },
    get basePath() {
      return API_BASE_PATCH;
    },
    random() {
      return uuid();
    },
    stringifyResponse({ status, body }: { status: number; body: any }) {
      return JSON.stringify(
        {
          Erro: {
            status: status,
            body: body,
          },
        },
        null,
        2
      );
    },
  };
}
