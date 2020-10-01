import { NextFunction, Request, Response } from 'express';
import AuthService from '@src/services/auth';

export function AuthMiddleware(
  request: Partial<Request>,
  response: Partial<Response>,
  next: NextFunction
): void {
  const token = request.headers?.['x-access-token'];
  try {
    const decoded = AuthService.decodeToken(token as string);
    request.decoded = decoded;
    next();
  } catch (err) {
    response.status?.(401).send({
      code: 401,
      error: err.message,
    });
  }
}
