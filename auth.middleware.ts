import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtPayload, decode } from 'jsonwebtoken';

interface CurrentUser {
  attributes: {
    email: string;
    fullname: string;
    shortname: string;
    lssSign: string;
    permissions: string[];
    userType: 'ADMIN' | 'AGENT' | 'CA' | 'GSA' | string;
    [key: string]: any;
  };
  locale: string;
  username: string;
  // [key : string ] : any
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request & { locals: any }, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      try {
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = decode(token) as JwtPayload;
        req.headers.data = JSON.stringify(decodedToken);
        next();
      } catch (e) {
        res.status(400).send({ msg: e.message });
      }
    } else {
      res.status(403).send({ msg: 'Forbidden' });
    }
  }
}
