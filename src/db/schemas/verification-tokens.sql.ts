import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { id } from "../schema-helper";

export const verificationTokens = pgTable("VerificationTokens", {
  id,
  user_id: varchar("user_id", { length: 50 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
});
