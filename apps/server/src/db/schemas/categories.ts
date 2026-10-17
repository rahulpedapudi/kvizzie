import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),

    title: text("title").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },

  (table) => [
    // case-insensitive uniqueness
    uniqueIndex("categories_title_lower_unique").on(sql`lower(${table.title})`),
  ],
);
