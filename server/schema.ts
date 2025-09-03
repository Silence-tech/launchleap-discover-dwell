import { pgTable, text, uuid, timestamp, integer, boolean, varchar, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user_id: uuid("user_id").unique().notNull(),
  username: text("username"),
  tagline: text("tagline"),
  bio: text("bio"),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Tools table
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url"),
  logo_url: text("logo_url"),
  is_paid: boolean("is_paid"),
  launch_date: timestamp("launch_date"),
  user_id: uuid("user_id"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Upvotes table
export const upvotes = pgTable("upvotes", {
  id: serial("id").primaryKey(),
  tool_id: integer("tool_id").references(() => tools.id),
  user_id: uuid("user_id"),
  created_at: timestamp("created_at").defaultNow(),
});