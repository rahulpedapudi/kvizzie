import { useMutation } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router"
import { api } from "@/lib/api"
import { useGame } from "@/hooks/useGame"
import { queryClient } from "@/lib/queryClient"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  ArrowLeft,
  Clock3,
  Layers3,
  LoaderCircle,
  Play,
  RotateCw,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react"

function formatDate(date: string | null) {
  if (!date) return "Not started"

  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default function Game() {
  const { gameId } = useParams()
  const navigate = useNavigate()

  const { data: game, isPending, isError, error, refetch } = useGame(gameId)

  const startGame = useMutation({
    mutationFn: async () => {
      if (!gameId) throw new Error("Missing game ID")

      // Adjust this endpoint to match your backend route.
      const response = await api.post(`/games/${gameId}/start`)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["gameDetail", gameId],
      })

      // Change this to your actual gameplay route.
      navigate(`/games/${gameId}/play`)
    },
  })

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center gap-3">
        <LoaderCircle className="size-5 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your game...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-xl font-semibold">Couldn't load this game</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button variant="outline" onClick={() => refetch()}>
          <RotateCw className="mr-2 size-4" />
          Try again
        </Button>
      </div>
    )
  }

  if (!game) return null

  const isWaiting = game.gamestatus === "waiting"

  const statusLabel: Record<string, string> = {
    waiting: "Waiting to start",
    in_progress: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
  }

  const difficultyStyles: Record<string, string> = {
    easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    medium:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    hard: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  }

  return (
    <main className="min-h-svh bg-muted/30">
      <div className="mx-auto max-w-5xl space-y-8 px-5 py-8 sm:px-8 sm:py-12">
        {/* Top navigation */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </button>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-10">
          <div className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative space-y-5">
            <Badge variant="outline" className="gap-2">
              <span
                className={`size-2 rounded-full ${
                  isWaiting
                    ? "bg-emerald-500"
                    : game.gamestatus === "in_progress"
                      ? "animate-pulse bg-amber-500"
                      : "bg-muted-foreground"
                }`}
              />
              {statusLabel[game.gamestatus] ?? game.gamestatus}
            </Badge>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {isWaiting ? "Your game is ready." : "Game lobby"}
              </h1>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                {isWaiting
                  ? "Review your settings and start when you're ready. Your quiz, your rules."
                  : "Here are the details for your quiz session."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Game ID</span>
              <code className="rounded-md border bg-muted px-2 py-1">
                {game.id}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(game.id)}
              >
                Copy ID
              </Button>
            </div>
          </div>
        </section>

        {/* Game configuration */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Game configuration</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Here's what you'll be playing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Layers3 className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="text-2xl font-bold">{game.questionCount}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Clock3 className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Per question</p>
                  <p className="text-2xl font-bold">{game.timePerQuestion}s</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Trophy className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <Badge
                    variant="outline"
                    className={`mt-1 capitalize ${difficultyStyles[game.difficulty] ?? ""}`}
                  >
                    {game.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Users className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">
                    {game.selectedCategories.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5" />
              Selected categories
            </CardTitle>
            <CardDescription>
              Questions will be drawn from these categories.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {game.selectedCategories.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {game.selectedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3 text-sm font-medium"
                  >
                    <span className="size-2 rounded-full bg-primary" />
                    {category.title}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No categories selected.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Session details */}
        <Card>
          <CardHeader>
            <CardTitle>Session details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Created</span>
              <span className="text-right">{formatDate(game.createdAt)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Started</span>
              <span className="text-right">{formatDate(game.startedAt)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="text-right">{formatDate(game.completedAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Start action */}
        <Card>
          <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                {isWaiting ? "Ready to begin?" : statusLabel[game.gamestatus]}
              </h2>
              <p className="max-w-lg text-sm leading-6 text-muted-foreground">
                {isWaiting
                  ? "Starting the game will prepare your questions and begin the session."
                  : game.gamestatus === "in_progress"
                    ? "This game has already started."
                    : "This session is no longer waiting to start."}
              </p>
              {startGame.isError && (
                <p role="alert" className="text-sm text-destructive">
                  {startGame.error.message}
                </p>
              )}
            </div>

            {isWaiting && (
              <Button
                size="lg"
                className="shrink-0"
                disabled={startGame.isPending}
                onClick={() => startGame.mutate()}
              >
                {startGame.isPending ? (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                ) : (
                  <Play className="mr-2 size-4" />
                )}
                {startGame.isPending ? "Starting..." : "Start Game"}
              </Button>
            )}

            {game.gamestatus === "in_progress" && (
              <Button
                size="lg"
                onClick={() => navigate(`/game/${game.id}/play`)}
              >
                Resume Game
              </Button>
            )}

            {game.gamestatus === "completed" && (
              <Badge variant="secondary" className="px-3 py-2">
                <ShieldCheck className="mr-2 size-4" />
                Game completed
              </Badge>
            )}
          </CardContent>
        </Card>

        <p className="pb-4 text-center text-xs text-muted-foreground">
          Good luck. May your knowledge exceed your confidence.
        </p>
      </div>
    </main>
  )
}
