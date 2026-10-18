import { type Request, type Response, Router } from "express";
import { getCategories } from "./category.controller";

export const categoryRouter = Router();

// GET all the categories
categoryRouter.get("", getCategories);
