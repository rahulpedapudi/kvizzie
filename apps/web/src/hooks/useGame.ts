import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export type SelectedCategoriesType = {
  id: string
  title: string
}

export type GameDetailResponse = {
  id: string
  hostId: string
  gamestatus: "waiting" | "in_progress" | "completed" | "cancelled"
  questionCount: number
  difficulty: "easy" | "medium" | "hard"
  timePerQuestion: number
  startedAt: string | null
  completedAt: string | null
  createdAt: string | null
  selectedCategories: SelectedCategoriesType[]
}

export const useGame = (gameId: string | undefined) => {
  return useQuery({
    queryKey: ["gameDetail", gameId],
    queryFn: async () => {
      const response = await api.get(`/games/${gameId}`)
      return response.data as GameDetailResponse
    },
    enabled: Boolean(gameId),
  })
}
