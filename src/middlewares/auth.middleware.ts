import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { getAuth } from 'src/helpers/auth.helper';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }
    const token = authHeader.split(' ')[1];
    try {
      const isValid = await this.jwtService.verifyAsync(token, { secret: '1234' });
      const auth = await getAuth(isValid.userId);
      req['auth'] = auth;
      next();
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
