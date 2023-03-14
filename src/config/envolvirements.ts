import { config } from 'dotenv';

config();

const {
  API_BASE_URL,
  API_PORT,
  API_JWKEY_PASSWORD,
  API_DEBUG,
  API_MASTER_KEY,
  API_ADMIN_TOKEN,
  API_USER_TOKEN,
  API_BASE_PATCH,
} = process.env;

export const envolvirements = {
  API_BASE_URL,
  API_PORT,
  API_JWKEY_PASSWORD,
  API_DEBUG,
  API_MASTER_KEY,
  API_ADMIN_TOKEN,
  API_USER_TOKEN,
  API_BASE_PATCH,
};
