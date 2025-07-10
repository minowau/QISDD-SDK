// QISDD Demo API: Auth Middleware

import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // TODO: Implement authentication logic
  next();
} 