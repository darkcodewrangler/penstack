import {
  pgTable,
  integer,
  varchar,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { id, created_at, updated_at } from "../schema-helper";

export const reactionTypes = pgTable("ReactionTypes", {
  id,
  name: varchar("name", { length: 50 }).notNull().unique(),
  display_name: varchar("display_name", { length: 50 }).notNull(),
  emoji: varchar("emoji", { length: 10 }),
  order: integer("order").default(0),
  is_active: boolean("is_active").default(true),
  allow_multiple: boolean("allow_multiple").default(true),
  created_at,
});

export const postReactions = pgTable(
  "PostReactions",
  {
    id,
    post_id: integer("post_id").notNull(),
    user_id: varchar("user_id", { length: 100 }).notNull(),
    reaction_type_id: integer("reaction_type_id").notNull(),
    created_at,
    updated_at,
  },
  (table) => ({
    uniqReaction: unique().on(
      table.post_id,
      table.user_id,
      table.reaction_type_id
    ),
  })
);

export const postShares = pgTable("PostShares", {
  id,
  post_id: integer("post_id").notNull(),
  user_id: varchar("user_id", { length: 100 }).notNull(),
  share_type: varchar("share_type", {
    length: 50,
    enum: ["facebook", "email", "whatsapp", "twitter", "link"],
  }).notNull(),
  share_url: varchar("share_url", { length: 255 }),
  created_at,
});
