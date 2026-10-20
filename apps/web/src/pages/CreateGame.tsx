import { useState, type FormEvent, type ReactNode } from "react"
import { useCategories } from "@/hooks/useCategories"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useCreateGame } from "@/hooks/useCreateGame"
import { useNavigate } from "react-router"

type Difficulty = "easy" | "medium" | "hard"

export default function CreateGame() {
  const { data: categories, isPending, isError, error } = useCategories()
  const {
    mutateAsync,
    isPending: isCreateGamePending,
    isSuccess: isCreateGameSuccess,
    isError: isCreateGameError,
    error: createGameError,
  } = useCreateGame()

  const navigate = useNavigate()

  const [categoryId, setCategoryId] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [questionCount, setQuestionCount] = useState(10)
  const [time, setTime] = useState(10)
  const [formError, setFormError] = useState("")
  const [gameId, setGameId] = useState("")

  if (isPending) return <p>Loading categories...</p>
  if (isError) return <p>{error.message}</p>

  const categoryItems: { label: ReactNode; value: string }[] = []

  if (!isPending) {
    categories.map((cat) => {
      categoryItems.push({ label: cat.title, value: cat.id })
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")

    if (!categoryId) {
      setFormError("Please select a category.")
      return
    }

    if (
      !Number.isInteger(questionCount) ||
      questionCount < 1 ||
      questionCount > 50
    ) {
      setFormError("Question count must be between 1 and 50.")
      return
    }

    if (!Number.isInteger(time) || time < 5 || time > 120) {
      setFormError("Time must be between 5 and 120 seconds.")
      return
    }

    try {
      const gameId = await mutateAsync({
        categoryId,
        difficulty,
        questionCount,
        time,
      })

      setGameId(gameId)
      navigate(`/game/${gameId}`)
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to create game."
      )
    }
  }

  return (
    <div className="min-h-svh p-6">
      <h1 className="mb-6 text-2xl font-semibold">Configure your Game</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        <div className="space-y-2">
          <Label>Category</Label>

          <Select
            items={categoryItems}
            value={categoryId}
            onValueChange={(value) => setCategoryId(value ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {categoryItems.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>

          <RadioGroup
            value={difficulty}
            onValueChange={(value) => setDifficulty(value as Difficulty)}
            className="flex gap-6"
          >
            {(["easy", "medium", "hard"] as const).map((level) => (
              <div key={level} className="flex items-center gap-2">
                <RadioGroupItem value={level} id={level} />
                <Label htmlFor={level} className="capitalize">
                  {level}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="questionCount">Question Count</Label>

          <input
            id="questionCount"
            type="number"
            min={1}
            max={50}
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.valueAsNumber)}
            className="w-full rounded-md border bg-background px-3 py-2"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time per Question (seconds)</Label>

          <input
            id="time"
            type="number"
            min={5}
            max={120}
            value={time}
            onChange={(e) => setTime(e.target.valueAsNumber)}
            className="w-full rounded-md border bg-background px-3 py-2"
            required
          />
        </div>

        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}

        <Button type="submit" disabled={isCreateGamePending}>
          {isCreateGamePending ? "Creating..." : "Create Game"}
        </Button>

        {isCreateGameError && (
          <p role="alert" className="text-sm text-destructive">
            {createGameError.message}
          </p>
        )}

        {isCreateGameSuccess && (
          <p role="alert" className="text-sm text-green-900">
            Created: {" " + gameId}
          </p>
        )}
      </form>
    </div>
  )
}
