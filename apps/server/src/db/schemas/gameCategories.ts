import { sql } from "drizzle-orm";
import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { games } from "./games";
import { categories } from "./categories";

export const gameCategories = pgTable(
  "game_categories",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),

    gameId: text("game_id").references(() => games.id, {
      onDelete: "cascade",
    }),

    gameCategoryId: text("game_category_id").references(() => categories.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [uniqueIndex("game_category_unique").on(t.gameId, t.gameCategoryId)],
);
