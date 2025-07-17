import { Controller, Get,UseGuards } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getUsers() {
    console.log('GET /user-management/users hit');
    return await this.userManagementService.getAllUsers();
  }
}
