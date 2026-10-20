import express, { Router } from "express";
import cors from "cors";
import { logger } from "./lib/middleware/logging";
import { categoryRouter } from "./modules/categories/category.routes";
import { questionsRouter } from "./modules/questions/question.routes";
import { gameRouter } from "./modules/game/game.routes";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    allowedHeaders: ["Content-Type", "Authorization"], // headers client can send
    credentials: true, // allow frontend to pass cookies/ auth headers
    maxAge: 86400,
  }),
);

// custom logger
app.use(logger);
app.use(express.json());

// master router
// should attach the individual feature routes to this router
const apiRouter = Router();

// feature routes
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/questions", questionsRouter);
apiRouter.use("/games", gameRouter);

apiRouter.get("/health", (req, res) => {
  res.send({ status: "healthy" });
});

apiRouter.head("/", (req, res) => {
  res.sendStatus(200);
});

// mounting the master router onto the /api/v1 prefix
app.use("/api/v1", apiRouter);

app.listen(PORT, () => {
  console.log(`Server Listening at PORT: ${PORT}`);
});
