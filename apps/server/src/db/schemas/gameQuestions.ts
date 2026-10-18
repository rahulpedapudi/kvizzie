import { sql } from "drizzle-orm";
import { integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { games } from "./games";
import { questions } from "./questions";

// contains questions to be used in a game
export const gameQuestions = pgTable(
  "game_questions",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),

    gameId: text("game_id").references(() => games.id, {
      onDelete: "cascade",
    }),

    questionId: text("question_id").references(() => questions.id, {
      onDelete: "cascade",
    }),

    points: integer("points").notNull(),
  },
  (t) => [uniqueIndex("question_uniqe").on(t.gameId, t.questionId)],
);
