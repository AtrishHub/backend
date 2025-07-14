import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  getProtectedMessage(user: any) {
    return {
      message: "This is protected data from NestJS 🚀",
      user: {
        id: user.sub,
        email: user.email,
      },
    };
  }
}