import { NextFunction, Request, Response } from 'express';
import { Error } from './error';
import { Token } from './token';
import { AccountRole, AuthenticatedRequest } from './types';

export class AuthMiddleware {
  public static isAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) return res.status(401).json(new Error('Not Auth'));

      const jwtPayload = Token.verify(token as string);
      if (!jwtPayload) return res.status(401).json(new Error('Not Auth'));

      req.account = jwtPayload?.account;
      next();
    } catch (e) {
      return res.status(401).json(new Error('Not Auth'));
    }
  }

  public static isNotAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) return res.status(401).json(new Error('Already auth'));

    next();
  }

  public static isGameMaster(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    if (req.account.role === AccountRole.gamemaster.toLowerCase())
      return next();
    return res.status(401).json(new Error('You are not GameMaster'));
  }

  public static isGameMasterOrCharacterOwner(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    if (
      req.account.role === AccountRole.gamemaster.toLowerCase() ||
      Number(req.params.id) == req.account.id
    )
      return next();
    return res
      .status(401)
      .json(new Error('You are not GameMaster or character owner'));
  }
}
