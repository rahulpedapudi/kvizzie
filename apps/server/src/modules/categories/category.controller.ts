import type { Request, Response } from "express";
import { getAllCategories } from "./category.service";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
  }
};
