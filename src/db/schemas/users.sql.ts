import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

import { posts } from "./posts.sql";
import { IdGenerator } from "@/src/utils";
import {
  created_at,
  updated_at,
  id,
  permissionsEnum,
  rolesEnum,
} from "../schema-helper";

const authType = pgEnum("auth_type", ["local", "google", "github", "facebook"]);
export const users = pgTable("Users", {
  id,
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  bio: varchar("bio", { length: 255 }),
  title: varchar("title", { length: 100 }),
  username: varchar("username", { length: 255 }),
  avatar: varchar("avatar", { length: 255 }),
  social_id: integer("social_id"),
  account_status: varchar("account_status", {
    length: 30,
    enum: ["active", "deleted", "banned", "inactive"],
  }).default("active"),
  auth_id: varchar("auth_id", { length: 100 }).$defaultFn(() =>
    IdGenerator.bigIntId()
  ),
  email_verified: boolean("email_verified").default(false),
  auth_type: authType("auth_type").default("local"),
  role_id: integer("role_id").notNull(),
  created_at,
  updated_at,
});

export const roles = pgTable(
  "Roles",
  {
    id,
    name: varchar("name", {
      length: 50,
      enum: rolesEnum,
    })
      .notNull()
      .unique(),
    description: varchar("description", { length: 255 }),
  },
  (table) => ({
    idxName: index("idx_name").on(table.name),
  })
);

export const permissions = pgTable(
  "Permissions",
  {
    id,
    name: varchar("name", {
      length: 50,
      enum: permissionsEnum,
    })
      .notNull()
      .unique(),
    description: varchar("description", { length: 255 }),
  },
  (table) => ({
    idxName: index("idx_name").on(table.name),
  })
);

export const rolePermissions = pgTable("RolePermissions", {
  id,
  role_id: integer("role_id").notNull(),
  permission_id: integer("permission_id").notNull(),
});

export const RoleRelations = relations(roles, ({ many }) => ({
  users: many(users),
  permissions: many(rolePermissions),
}));

export const PermissionRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

export const RolePermissionRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.role_id],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permission_id],
      references: [permissions.id],
    }),
  })
);

export const userSocials = pgTable("UserSocials", {
  id,
  user_id: varchar("user_id", { length: 100 }).notNull(),
  github: varchar("github", { length: 100 }),
  facebook: varchar("facebook", { length: 100 }),
  email: varchar("email", { length: 100 }),
  website: varchar("website", { length: 100 }),
  updated_at,
});

export const UserRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
  socials: one(userSocials, {
    fields: [users.social_id],
    references: [userSocials.id],
  }),
  role: one(roles, {
    fields: [users.role_id],
    references: [roles.id],
  }),
}));
