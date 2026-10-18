import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { questions, questionCategories } from "../../db/schemas";

export const getQuestions = async (categoryId: string | undefined) => {
  if (!categoryId) {
    throw new Error("Provide CategoryId");
  }

  const results = await db
    .select({
      id: questions.id,
      categoryId: questionCategories.categoryId,
      text: questions.text,
      difficulty: questions.difficulty,
      authorID: questions.authorID,
      status: questions.status,
      createdAt: questions.createdAt,
      updatedAt: questions.updatedAt,
    })
    .from(questions)
    .innerJoin(
      questionCategories,
      eq(questions.id, questionCategories.questionId),
    ) // innerjoin makes it explicit that a question must have a category relationship
    .where(
      and(
        eq(questionCategories.categoryId, categoryId),
        eq(questions.status, "published"),
      ),
    );

  return results;
};
