import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Body,
    UseGuards,
    Request,
    Query,
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport'; 
import { TeamCreatorGuard } from './guards/team-creator.guard';
import { UploadsService } from './uploads.service';
import { DocumentProcessingService } from 'src/document-processing/document-processing.service';

class FileUploadDto {
  teamId: string;
}

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly documentProcessingService: DocumentProcessingService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), TeamCreatorGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('teamId') teamId: string,
    @Request() req,
  ) {
    const creatorId = req.user.sub;
    const fileMetadata = {
      filename: file.originalname,
      filepath: file.path,
      mimetype: file.mimetype,
      teamId,
      creatorId,
    };

    const record = await this.uploadsService.create(fileMetadata);

    // Automatically process and embed the document
    await this.documentProcessingService.process(
      file.path,
      record.id, // Use the upload record's id as documentId
      file.originalname
    );

    return {
      message: 'File uploaded and embedded successfully!',
      data: record,
    };
  }
}