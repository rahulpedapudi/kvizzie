import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { questions } from "./questions";
import { categories } from "./categories";

export const questionCategories = pgTable(
  "question_categories",
  {
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id, {
        onDelete: "cascade",
      }),

    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [primaryKey({ columns: [t.questionId, t.categoryId] })],
);
