import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AuthGuard } from '@nestjs/passport'; 
  import { TeamCreatorGuard } from './guards/team-creator.guard';
  import { UploadsService } from './uploads.service';
 
  class FileUploadDto {
    teamId: string;
    
  }
  
  @Controller('uploads')
  export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) {}
  
    @Post()
    @UseGuards(AuthGuard('jwt'), TeamCreatorGuard) 
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
      @UploadedFile(/*...your pipes...*/) file: Express.Multer.File,
      @Body() body: FileUploadDto,
      @Request() req, 
    ) {
      const { teamId } = body;
      const creatorId = req.user.id;
      const fileMetadata = {
        filename: file.originalname,
        filepath: file.path,
        mimetype: file.mimetype,
        teamId,
        creatorId, 
      };
  
      const record = await this.uploadsService.create(fileMetadata);
  
      return {
        message: 'File uploaded successfully!',
        data: record,
      };
    }
  }