import { Controller, Post, Get, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  create(@Body() dto: CreateFolderDto) {
    return this.folderService.create(dto);
  }

  @Get('team/:teamId')
  findAllByTeam(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.folderService.findAllByTeam(teamId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.folderService.findById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFolderDto) {
    return this.folderService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.folderService.delete(id);
  }

  @Get('tree/:teamId')
  getFolderTree(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.folderService.getFolderTree(teamId);
  }
} 