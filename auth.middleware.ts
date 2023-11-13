import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { decode, verify } from 'jsonwebtoken';

const mockData = {
  'additional-data': {
    id: '0e941a81-3b72-0c95-8a59-c225b7069987',
    name: 'Airesources',
    username: '28382266-Admin',
    userType: 'GSA',
    aclAccountId: 'LTX2FTSPEKDB',
    organization: {
      org: '648dbad0-1295-24c6-520b-59bd9a2045b9',
      officeid: 'HANVN00TK',
      iatanumber: '28382266',
      caCode: null,
      caNunber: '28382266',
      lssSign: [],
    },
  },
  sub: '28382266-Admin',
  aud: 'webAppClient',
  nbf: 1699844577,
  iss: 'https://vna-dev.ngsd.vn',
  exp: 1699846377,
  iat: 1699844577,
  authorities: [
    'row_level_role:P_GSA',
    'A_PAYMENT_GILFCARD.EXECUTE',
    'A_PAYMENT_ACL.EXECUTE',
    'row_level_role:P_authenticated-non-admin-access',
    'R_GSA_USER.CREATE',
    'R_ROLE_authenticated-access',
    'R_GSA_USER.UPDATE',
    'A_GSA_USER.CHANGE_STATUS',
    'rest-minimal',
    'A_BOOKING_TICKET.EXECUTE',
    'R_ROLE_gsa',
    'R_GSA_USER.READ',
    'A_GSA_USER.RESET_PASS',
    'A_PAYMENT_EVOUCHER.EXECUTE',
  ],
};
export type LoginedUser = typeof mockData;
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request & { locals: any }, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      try {
        const token = authorizationHeader.split(' ')[1];

        // const decodedToken = verify(token, `${process.env.SECRET_KEY}`, {
        //   algorithms: ['RS384'],
        // }) as LoginedUser;

        const decodedToken = decode(token) as LoginedUser;
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
