import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import CreateGame from "./pages/CreateGame.tsx"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/queryClient.ts"
import Game from "./pages/Game.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/game",
    element: <CreateGame />,
  },
  {
    path: "/game/:gameId",
    element: <Game />,
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)
