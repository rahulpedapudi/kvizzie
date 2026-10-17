import { sql } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { questions } from "./questions";

export const questionOptions = pgTable("question_options", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()::text`),

  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, {
      onDelete: "cascade",
    }),

  text: text("text").notNull(),

  isCorrect: boolean("is_correct").notNull().default(false),
});
