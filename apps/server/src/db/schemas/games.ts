// a game can be in any of these states => [waiting, active, completed, cancelled]
// a game can contain any number of category questions (science + maths)
// host can decide the number of questions, difficulty level, timer etc..

import { sql } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { difficultyEnum } from "./questions";

export const gameStatusEnum = pgEnum("game_status", [
  "waiting",
  "active",
  "completed",
  "cancelled",
]);

export const games = pgTable("games", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()::text`),

  // who created the game
  hostId: text("host_id"),

  gamestatus: gameStatusEnum("game_status").default("waiting"),
  // joinCode: text("join_code"),

  requestedQuestionCount: integer("requested_question_count")
    .notNull()
    .default(15),

  availableQuestionCount: integer("available_question_count"),

  difficulty: difficultyEnum("difficulty").notNull().default("easy"),

  // in seconds
  timePerQuestion: integer("time_per_question").notNull().default(15),

  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
