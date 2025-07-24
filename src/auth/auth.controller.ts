import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { IsNull } from 'typeorm';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller("auth")
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Get( )

  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Get protected user data' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved protected data.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. No token provided or token is invalid.' })


  getSecret(@Req() req) {
    return {
      message: "This is protected data By me ",
      user: req.user,
    };
  }
}