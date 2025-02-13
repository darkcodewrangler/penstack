import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { id, created_at, updated_at } from "../schema-helper";

export const newsletters = pgTable("NewsLetters", {
  id,
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  status: varchar("status", {
    length: 255,
    enum: ["subscribed", "unsubscribed"],
  })
    .notNull()
    .default("subscribed"),
  verification_status: varchar("verification_status", {
    length: 255,
    enum: ["verified", "unverified"],
  })
    .notNull()
    .default("unverified"),
  verification_token: varchar("verification_token", { length: 255 }),
  verification_token_expires: timestamp("verification_token_expires"),
  unsubscribed_at: timestamp("unsubscribed_at"),
  referrer: varchar("referrer", { length: 255 }),
  created_at,
  updated_at,
});
