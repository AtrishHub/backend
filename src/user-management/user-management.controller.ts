import { Controller, Get,UseGuards, Req } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User Management') 
@ApiBearerAuth() 

@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a list of all users' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all users.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getUsers() {
    console.log('GET /user-management/users hit');
    return await this.userManagementService.getAllUsers();
  }

  @Get('dashboard')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: "Get All data for the authenticated user" })
  @ApiResponse({ status: 200, description: "Successfully retrieved user's data." })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getDashboard(@Req() req) {
    return this.userManagementService.getUserDashboard(req.user.sub);
  }
}
