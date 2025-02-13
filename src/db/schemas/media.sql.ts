import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { created_at, id, updated_at } from "../schema-helper";

export const medias = pgTable("Medias", {
  id,
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  type: varchar("type", {
    length: 100,
    enum: ["audio", "image", "video", "pdf", "doc"],
  }).notNull(),
  size: integer("size").notNull(),
  mime_type: varchar("mime_type", { length: 100 }),
  caption: varchar("caption", { length: 255 }),
  alt_text: varchar("alt_text", { length: 255 }),
  width: integer("width"),
  height: integer("height"),
  folder: varchar("folder", { length: 255 }),
  created_at,
  updated_at,
});
