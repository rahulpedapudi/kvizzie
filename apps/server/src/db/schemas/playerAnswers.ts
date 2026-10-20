// stores a player's response to a particular game question

import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { gameQuestions } from "./gameQuestions";
import { gamePlayers } from "./gamePlayers";

export const playerAnswers = pgTable(
  "player_answers",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),

    gameId: text("game_id").notNull(),
    playerId: text("player_id").notNull(),

    gameQuestionId: text("game_question_id").notNull(),

    isCorrect: boolean("is_corrected").notNull().default(false),

    answeredAt: timestamp("answered_at").defaultNow(),
  },
  (t) => [
    foreignKey({
      columns: [t.gameId, t.playerId],
      foreignColumns: [gamePlayers.gameId, gamePlayers.playerId],
    }).onDelete("cascade"),

    foreignKey({
      columns: [t.gameId, t.gameQuestionId],
      foreignColumns: [gameQuestions.gameId, gameQuestions.questionId],
    }).onDelete("cascade"),

    uniqueIndex("player_answers_game_player_question_unique").on(
      t.gameId,
      t.playerId,
      t.gameQuestionId,
    ),
  ],
);
