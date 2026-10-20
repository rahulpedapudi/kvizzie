import { Router } from "express";
import { createLobby, getGame, getGames, startGame } from "./game.controller";
import { validate } from "../../lib/middleware/validate";
import { CreateLobbyRequestBody, FetchGamesQueryParam } from "./game.schema";

export const gameRouter = Router();

gameRouter.get("/:id", getGame);
gameRouter.get("", validate(FetchGamesQueryParam), getGames);
gameRouter.post("", validate(CreateLobbyRequestBody), createLobby);
gameRouter.post("/:id/start", startGame);
