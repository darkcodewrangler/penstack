import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas";

const {
  DB_NAME,
  DB_PORT,
  DB_USER_NAME,
  DB_USER_PASS,
  DB_SSL_CONFIG,
  DB_HOST,
  DATABASE_URL,
} = process.env;
export const dbDetails = {
  DB_NAME,
  DB_PORT,
  DB_USER_NAME,
  DB_SSL_CONFIG,
  DB_USER_PASS,
  DB_HOST,
};

export const connectionUri = DATABASE_URL as string;
const client = postgres(connectionUri, { prepare: false });
export const db = drizzle(client);
