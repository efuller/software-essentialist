import { NextFunction, Request, Response } from "express";
import {
  StudentAssignmentNotFoundException,
  ClassNotFoundException,
  InvalidRequestBodyException,
  StudentAlreadyEnrolledException,
  StudentNotFoundException
} from "./exceptions";
import { ERROR_EXCEPTION } from "./constants";

export type ErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => Response;

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof InvalidRequestBodyException) {
    return res.status(400).json({
      error: ERROR_EXCEPTION.VALIDATION_ERROR,
      data: undefined,
      success: false,
      message: error.message
    });
  }

  if (error instanceof InvalidRequestBodyException) {
    return res.status(400).json({
      error: ERROR_EXCEPTION.VALIDATION_ERROR,
      data: undefined,
      success: false,
      message: error.message
    });
  }

  if (error instanceof StudentNotFoundException) {
    return res.status(404).json({
      error: ERROR_EXCEPTION.STUDENT_NOT_FOUND,
      data: undefined,
      success: false,
      message: error.message
    });
  }

  if (error instanceof StudentAlreadyEnrolledException) {
    return res.status(400).json({
      error: ERROR_EXCEPTION.STUDENT_ALREADY_ENROLLED,
      data: undefined,
      success: false,
      message: error.message
    });
  }

  if (error instanceof ClassNotFoundException) {
    return res.status(404).json({
      error: ERROR_EXCEPTION.CLASS_NOT_FOUND,
      data: undefined,
      success: false,
      message: error.message
    });
  }

  if (error instanceof StudentAssignmentNotFoundException) {
    return res.status(404).json({
      error: ERROR_EXCEPTION.ASSIGNMENT_NOT_FOUND,
      data: undefined,
      success: false,
      message: error.message
    });
  }

  return res.status(500).json({
    error: ERROR_EXCEPTION.SERVER_ERROR,
    data: undefined,
    success: false,
    message: error.message
  });
}