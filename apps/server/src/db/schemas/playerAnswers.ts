// stores a player's response to a particular game question

import { sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { gameQuestions } from "./gameQuestions";
import { gamePlayers } from "./gamePlayers";

export const playerAnswers = pgTable("player_answers", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()::text`),

  gamePlayerId: text("game_player_id").references(() => gamePlayers.playerId),

  gameQuestionId: text("game_question_id").references(
    () => gameQuestions.questionId,
  ),

  isCorrect: boolean("is_corrected").notNull().default(false),

  answeredAt: timestamp("answered_at").defaultNow(),
});
