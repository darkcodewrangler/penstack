import {
  index,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { posts } from "./posts.sql";
import { users } from "./users.sql";
import { relations, sql } from "drizzle-orm";
import { id, created_at } from "../schema-helper";

export const postViews = pgTable(
  "PostViews",
  {
    id,
    post_id: integer("post_id").notNull(),
    user_id: varchar("user_id", { length: 100 }), // Nullable for anonymous views
    ip_address: varchar("ip_address", { length: 45 }), // IPv6 compatible
    user_agent: varchar("user_agent", { length: 255 }),
    referrer: varchar("referrer", { length: 255 }),
    viewed_at: timestamp("viewed_at").defaultNow(),
  },
  (table) => ({
    idx_post_views_session: index("idx_post_views_session").on(
      table.post_id,
      table.user_id,
      table.viewed_at
    ),
  })
);

// Detailed analytics for user behavior
export const postViewAnalytics = pgTable(
  "PostViewAnalytics",
  {
    id,
    post_id: integer("post_id").notNull(),
    user_id: varchar("user_id", { length: 100 }), // Nullable for anonymous users
    session_id: varchar("session_id", { length: 255 }),
    device_type: varchar("device_type", { length: 50 }), // mobile, tablet, desktop
    browser: varchar("browser", { length: 50 }),
    os: varchar("os", { length: 50 }),
    country: varchar("country", { length: 2 }),
    region: varchar("region", { length: 100 }),
    city: varchar("city", { length: 100 }),
    time_spent: integer("time_spent"), // in seconds
    scroll_depth: integer("scroll_depth"), // percentage
    entry_point: varchar("entry_point", { length: 255 }), // URL they came from
    exit_point: varchar("exit_point", { length: 255 }), // URL they went to
    created_at,
  },
  (table) => ({
    idx_analytics_session: index("idx_analytics_session").on(
      table.post_id,
      table.created_at,
      table.session_id
    ),
  })
);

// Real-time tracking (for active users/current viewers)
export const activePostViewers = pgTable("ActivePostViewers", {
  id,
  post_id: integer("post_id").notNull(),
  user_id: varchar("user_id", { length: 100 }),
  session_id: varchar("session_id", { length: 255 }).notNull(),
  last_active: timestamp("last_active").defaultNow(),
  created_at,
});

export const postViewsRelations = relations(postViews, ({ one }) => ({
  post: one(posts, {
    fields: [postViews.post_id],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postViews.user_id],
    references: [users.auth_id],
  }),
}));
