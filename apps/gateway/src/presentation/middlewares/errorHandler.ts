import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { createLogger } from '@task-system/shared';

const logger = createLogger('API-Gateway');

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`);
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Handle JSON parsing errors from express.json()
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    logger.warn(`SyntaxError: Invalid JSON payload`);
    return res.status(400).json({
      status: 'error',
      message: 'Invalid JSON payload format',
    });
  }

  if (err instanceof ZodError) {
    logger.warn('ValidationError: Invalid DTO');
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: err.errors,
    });
  }

  logger.error(`Internal Server Error: ${err.message}\n${err.stack}`);
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};
