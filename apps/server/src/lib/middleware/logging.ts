import { type Request, type Response, type NextFunction } from "express";

export const logger = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(
    `-- [ SERVER ] - ${req.method} - ${req.url}\n\tRequestBody: ${req.body}`,
  );
  next();
};
