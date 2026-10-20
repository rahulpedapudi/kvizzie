import { useQuery } from "@tanstack/react-query"

export type Category = {
  id: string
  title: string
  createdAt: string
}

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/v1/categories")

      if (!response.ok) throw new Error("Network Error occured")

      const categories: Category[] = await response.json()
      return categories
    },
  })
