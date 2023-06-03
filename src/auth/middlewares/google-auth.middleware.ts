import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { CustomRequest } from '../interfaces/auth.interface';

@Injectable()
export class GoogleOAuthMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: () => void) {
    const { authorization } = req.headers;
    if (!authorization) throw new BadRequestException();

    const accessToken = authorization.replace('Bearer ', '');
    if (!accessToken) throw new BadRequestException();
    req.accessToken = accessToken;
    next();
  }
}
