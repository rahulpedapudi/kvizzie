import type { Request, Response } from "express";
import { getQuestions } from "./question.service";

export const getQuestionsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;

    const questions = await getQuestions(categoryId as string);

    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
  }
};
