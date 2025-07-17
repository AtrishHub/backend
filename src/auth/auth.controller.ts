import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Get( )
  getSecret(@Req() req) {
    return {
      message: "This is protected data By me ",
      user: req.user,
    };
  }
}