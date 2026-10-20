import * as z from "zod";

export const CreateLobbyRequestBody = z.object({
  body: z.object({
    categoryId: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    questionCount: z.number().positive(),
    time: z.number().positive(),
  }),
});

export const FetchGamesQueryParam = z.object({
  query: z.object({
    status: z.enum(["waiting", "active", "completed", "cancelled"]).optional(),
  }),
});

export const GameIdPathParam = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type CreateLobbyInput = z.infer<typeof CreateLobbyRequestBody>["body"];

export type FetchGamesQueryInput = z.infer<
  typeof FetchGamesQueryParam
>["query"];

export type GameIdPathParamInput = z.infer<typeof GameIdPathParam>["params"];
