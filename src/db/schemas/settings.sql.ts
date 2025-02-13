import { sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { created_at, updated_at, id } from "../schema-helper";

export const siteSettings = pgTable(
  "SiteSettings",
  {
    id,
    key: varchar("key", {
      length: 255,
    }).notNull(),
    value: text("value"),
    enabled: boolean("enabled").default(false),
    created_at,
    updated_at,
  },
  (table) => ({
    idxKey: uniqueIndex("idx_key").on(table.key),
  })
);
