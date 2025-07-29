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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

class FileUploadDto {
  teamId: string;
}
@ApiTags('Uploads') 
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly documentProcessingService: DocumentProcessingService,
  ) {}

  @Post('test')
  @ApiOperation({ summary: 'Test upload endpoint without authentication' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload for testing',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to upload.',
        },
      },
    },
  })
  @ApiQuery({
      name: 'teamId',
      required: true,
      type: String,
      description: 'The ID of the team to associate the file with.'
  })
  @ApiResponse({ status: 201, description: 'File uploaded and embedded successfully.' })
  @UseInterceptors(FileInterceptor('file'))
  async testUploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('teamId') teamId: string,
  ) {
    const creatorId = 'test-user-id';
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
      documentId: record.id,
    };
  }

  @Post()
  @ApiBearerAuth() // Indicates that this endpoint requires a JWT Bearer token
  @ApiOperation({ summary: 'Upload a file and associate it with a team' })
  @ApiConsumes('multipart/form-data') // Specifies the content type
  @ApiBody({
    description: 'File to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // Important for file uploads
          description: 'The file to upload.',
        },
      },
    },
  })
  @ApiQuery({
      name: 'teamId',
      required: true,
      type: String,
      description: 'The ID of the team to associate the file with.'
  })
  @ApiResponse({ status: 201, description: 'File uploaded and embedded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request. File or teamId may be missing.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have permission.' })
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
      file.originalname,
      record.teamId // Pass teamId to embedding metadata
    );

    return {
      message: 'File uploaded and embedded successfully!',
      data: record,
    };
  }
}