import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
import { api } from "@/lib/api"

export const useStartGame = () => {
  return useMutation({
    mutationKey: ["startGame"],
    mutationFn: async (gameId: string) => {
      const response = await api.post(`/games/${gameId}`)
      const data = response.data
      return data
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["gameDetail"],
      })
    },
  })
}
