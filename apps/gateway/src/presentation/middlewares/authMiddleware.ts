import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt';
import { AppError } from './errorHandler';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token not provided', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verifyToken(token);
    // Anexa o ID do usuário verificado no Request para os Controllers
    req.user = { id: decoded.userId };
    return next();
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};

// Extensão da tipagem global do Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}
