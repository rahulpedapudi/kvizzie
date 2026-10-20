import type { Request, Response } from "express";
import {
  fetchGames,
  getGameById,
  prepareLobby,
  startNewGame,
} from "./game.service";
import type {
  CreateLobbyInput,
  FetchGamesQueryInput,
  GameIdPathParamInput,
} from "./game.schema";

// POST /games
export const createLobby = async (
  req: Request<{}, {}, CreateLobbyInput>,
  res: Response,
) => {
  try {
    // TODO: i need to get the host id
    const hostId = "1";

    const { categoryId, difficulty, questionCount, time } = req.body;

    const gameId = await prepareLobby(
      hostId,
      categoryId,
      difficulty,
      questionCount,
      time,
    );

    res.status(201).send({ gameId: gameId });
  } catch (err) {
    console.error(err);
  }
};

// POST /games/:id
export const startGame = async (
  req: Request<GameIdPathParamInput>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const result = await startNewGame(id);

    res.status(201).send(result);
  } catch (err) {
    console.error(err);
  }
};

// GET /games/:id
export const getGame = async (
  req: Request<GameIdPathParamInput>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const response = await getGameById(id);
    res.status(200).send(response);
  } catch (err) {
    console.error(err);
  }
};

// GET /games?status=
export const getGames = async (
  req: Request<{}, {}, {}, FetchGamesQueryInput>,
  res: Response,
) => {
  try {
    const { status } = req.query;
    const results = await fetchGames(status!);
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
  }
};
