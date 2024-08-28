import { NextFunction, Request, Response } from "express";

export type ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => Response;

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  return res.status(500).send("Something went wrong");
}