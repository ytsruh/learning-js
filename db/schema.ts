import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

const client = neon(process.env.DATABASE_URL as string);
export const db = drizzle(client);

export const prompts = pgTable("Prompts", {
  id: varchar("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  text: varchar("description").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
});

export type Prompt = typeof prompts.$inferSelect; // return type when queried
export type NewPrompt = typeof prompts.$inferInsert; // insert type

export const feedback = pgTable("Feedback", {
  id: varchar("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  text: varchar("description").notNull(),
  name: varchar("name").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
});

export type Feedback = typeof feedback.$inferSelect; // return type when queried
export type NewFeedback = typeof feedback.$inferInsert; // insert type
