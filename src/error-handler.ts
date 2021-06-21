import { NextFunction, Request, Response } from "express";

import { ResponseError } from "./models/schemas";

export const handle404 = (req: Request, res: Response, next: NextFunction) => {
  const error: ResponseError = new Error(
    "Path not found or method not allowed"
  );
  error.status = 404;
  next(error);
};

export const basicErrorHandler = (
  error: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
};
