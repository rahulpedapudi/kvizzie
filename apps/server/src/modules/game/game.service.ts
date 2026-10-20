import { db } from "../../db/db";
import { games } from "../../db/schemas/games";
import type {
  difficulty,
  gameStatus,
} from "../../../../../packages/shared/src/types";
import { SCORES } from "../../../../../packages/shared/src/constants";
import { gameCategories } from "../../db/schemas/gameCategories";
import { eq, type EmptyRelations } from "drizzle-orm";
import { getQuestions } from "../questions/question.service";
import { categories, gameQuestions } from "../../db/schemas";
import type { PgAsyncTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";

export const prepareLobby = async (
  hostId: string,
  categoryId: string,
  difficulty: difficulty,
  questionCount: number,
  time: number,
) => {
  // inserting the game config to games table
  const [inserted] = await db
    .insert(games)
    .values({
      hostId: hostId,
      difficulty: difficulty,
      questionCount: questionCount,
      gamestatus: "waiting",
      timePerQuestion: time,
    })
    .returning({ gameId: games.id });

  if (!inserted) {
    throw new Error("Cannot insert game;");
  }

  // inserting gameid and categoryid to game_categories table
  await db.insert(gameCategories).values({
    gameId: inserted.gameId,
    gameCategoryId: categoryId,
  });

  return inserted.gameId;
};

export const fetchGames = async (status: gameStatus | null) => {
  if (status) {
    return await db.select().from(games).where(eq(games.gamestatus, status));
  }
  return await db.select().from(games);
};

export const getGameById = async (
  id: string,
  tx?: PgAsyncTransaction<PostgresJsQueryResultHKT, EmptyRelations>,
) => {
  if (!tx) {
    tx = await db.transaction(async (tx) => {
      return tx;
    });
  }

  const [game] = await tx.select().from(games).where(eq(games.id, id)).limit(1);

  if (!game) {
    throw new Error("Game Not Found!");
  }

  // query to get ids, names of the categories which are selected in a game
  const configuredCategories = await tx
    .select({
      categoryId: gameCategories.gameCategoryId,
      categoryName: categories.title,
    })
    .from(gameCategories)
    .innerJoin(categories, eq(gameCategories.gameCategoryId, categories.id))
    .where(eq(gameCategories.gameId, id));

  if (!categories) {
    throw new Error("Game Must have Category!");
  }

  // {id, title}
  let selectedCategories: Array<Record<string, string>> = [];

  for (const entry of configuredCategories) {
    selectedCategories.push({
      id: entry.categoryId!,
      title: entry.categoryName,
    });
  }

  return {
    ...game,
    selectedCategories: selectedCategories,
  };
};

export const startNewGame = async (id: string) => {
  // entire thing should be in a single transaction

  const results = await db.transaction(async (tx) => {
    // 1. Fetch and validate game
    const game = await getGameById(id, tx);

    if (game.gamestatus !== "waiting") {
      throw new Error("Game has already been started or Cancelled by host");
    }
    // 2. Fetch configured categories and difficulty
    const {
      difficulty,
      requestedQuestionCount,
      timePerQuestion,
      selectedCategories,
    } = game;

    // 3. Select random, unique published questions
    const selectedQuestions = await getQuestions(
      tx,
      selectedCategories,
      difficulty,
      requestedQuestionCount,
    );

    // console.log(selectedQuestions);

    // 4. Verify enough questions are available and change the questionCount if there are less than no of questions requested
    let availableQuestions = requestedQuestionCount;

    if (selectedQuestions.length <= requestedQuestionCount) {
      availableQuestions = selectedQuestions.length;
    }

    // 5. Insert game_questions with position and points
    selectedQuestions.forEach(async (q, index) => {
      await tx.insert(gameQuestions).values({
        gameId: id,
        questionId: q.id,
        position: index,
        points: SCORES[q.difficulty],
      });
    });

    // 6. Ensure host exists in game_players
    // TODO

    // 7. Transition game from waiting to active
    const [udpdatedGame] = await tx
      .update(games)
      .set({
        gamestatus: "active",
        requestedQuestionCount: requestedQuestionCount,
        availableQuestionCount: availableQuestions,
        startedAt: new Date(),
      })
      .where(eq(games.id, id))
      .returning();

    return {
      gameId: udpdatedGame?.id,
      gameStatus: udpdatedGame?.gamestatus,
      startedAt: udpdatedGame?.startedAt,
      requestedQuestionCount: udpdatedGame?.requestedQuestionCount,
      availableQuestionCount: udpdatedGame?.availableQuestionCount,
    };
  });

  return results;
};
