import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

// TODO
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()::text`),

  userName: text("user_name").notNull(),
});
