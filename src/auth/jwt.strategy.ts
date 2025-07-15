// auth/jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as jwksRsa from "jwks-rsa";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-36rjr75zav7uajc1.us.auth0.com/.well-known/jwks.json`,
      }),
      audience:"https://myapi.local" ,
      issuer: 'https://dev-36rjr75zav7uajc1.us.auth0.com/',
      algorithms: ["RS256"],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
