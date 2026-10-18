import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { games } from "./games";
import { users } from "./users";

export const playerStatus = pgEnum("player_status", [
  "joined",
  "disconnected",
  "left",
]);

export const gamePlayers = pgTable(
  "game_players",
  {
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, {
        onDelete: "cascade",
      }),

    playerId: text("player_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    score: integer("score").notNull().default(0),

    playerStatus: playerStatus("player_status").notNull().default("joined"),

    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.gameId, t.playerId] })],
);
