import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

// posgresql enum types
export const statusEnum = pgEnum("question_status", [
  "private",
  "published",
  "archived",
  "pending_review",
]);

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const questions = pgTable("questions", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()::text`),

  text: text("text").notNull(),

  difficulty: difficultyEnum("difficulty").notNull(),

  // author of the question
  authorID: text("author_id").references(() => users.id, {
    onDelete: "set null",
  }),

  status: statusEnum("status").default("private").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
