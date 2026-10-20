import { and, eq, inArray, sql, type EmptyRelations } from "drizzle-orm";
import { db } from "../../db/db";
import { type difficulty } from "../../../../../packages/shared/src/types";
import { questions, questionCategories } from "../../db/schemas";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";

export const getQuestions = async (
  tx: PgAsyncTransaction<PostgresJsQueryResultHKT, EmptyRelations>,
  categories: Array<Record<string, string>> | null,
  difficulty: difficulty | null,
  questionCount: number = 15,
) => {
  let filters = [];

  if (categories && categories.length > 0) {
    filters.push(
      inArray(
        questionCategories.categoryId,
        categories.map((cat) => cat.id!),
      ),
    );
  }

  if (difficulty) {
    filters.push(eq(questions.difficulty, difficulty!));
  }

  const results = await tx
    .select({
      id: questions.id,
      difficulty: questions.difficulty,
    })
    .from(questions)
    .innerJoin(
      questionCategories,
      eq(questions.id, questionCategories.questionId),
    )
    .where(
      and(
        filters.length > 0 ? and(...filters) : undefined,
        eq(questions.status, "published"),
      ),
    )
    .groupBy(questions.id, questions.difficulty)
    .orderBy(sql`random()`)
    .limit(questionCount);

  return results;
};

function test() {}
