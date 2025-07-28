import { Controller, Post, Get, Patch, Delete, Param, Body, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Folders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new folder' })
  @ApiResponse({ status: 201, description: 'Folder successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() dto: CreateFolderDto) {
    return this.folderService.create(dto);
  }

  @Get('team/:teamId')
  @ApiOperation({ summary: 'Get all root folders for a specific team' })
  @ApiParam({ name: 'teamId', description: 'The UUID of the team' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved root folders.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllByTeam(@Param('teamId') teamId: string) {
    return this.folderService.findAllByTeam(teamId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific folder by its ID' })
  @ApiParam({ name: 'id', description: 'The numeric ID of the folder' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved folder.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Folder not found.' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.folderService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a folder\'s details' })
  @ApiParam({ name: 'id', description: 'The numeric ID of the folder to update' })
  @ApiResponse({ status: 200, description: 'Folder successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Folder not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFolderDto) {
    return this.folderService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a folder' })
  @ApiParam({ name: 'id', description: 'The UUID of the folder to delete' })
  @ApiResponse({ status: 200, description: 'Folder successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Folder not found.' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.folderService.delete(id);
  }

  @Get('tree/:teamId')
  @ApiOperation({ summary: 'Get the complete nested folder tree for a team' })
  @ApiParam({ name: 'teamId', description: 'The UUID of the team' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved folder tree.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getFolderTree(@Param('teamId') teamId: string) {
    return this.folderService.getFolderTree(teamId);
  }
} 