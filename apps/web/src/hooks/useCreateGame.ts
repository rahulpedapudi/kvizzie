import { useMutation } from "@tanstack/react-query"

type CreateGameResponse = {
  gameId: string
}

export const useCreateGame = () => {
  return useMutation({
    mutationFn: async (payload: {
      categoryId: string
      difficulty: "easy" | "medium" | "hard"
      questionCount: number
      time: number
    }) => {
      const response = await fetch("http://localhost:3000/api/v1/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const responseBody: CreateGameResponse = await response.json()

      return responseBody.gameId
    },
  })
}
