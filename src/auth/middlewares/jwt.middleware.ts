import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { CustomRequest } from '../interfaces/auth.interface';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: () => void) {
    const { authorization } = req.headers;
    if (!authorization) next();

    const accessToken = authorization.replace('Bearer ', '');
    if (!accessToken) next();
    req.accessToken = accessToken;
    next();
  }
}
