import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt, IsUUID } from 'class-validator';

export class CreateFolderDto {
  @ApiProperty({
    description: 'The name of the folder',
    example: 'Q3 Marketing Reports',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'An optional description for the folder',
    example: 'All reports related to the third quarter marketing campaign.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The UUID of the team this folder belongs to',
    example: '47910454-619d-4bd6-b31a-1b4dd1e2598c',
  })
  @IsUUID()
  teamId: string;


  @ApiProperty({
    description: 'The ID of the parent folder, if creating a sub-folder',
    example: '47910454-619d-4bd6-b31a-1b4dd1e3454c',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;
} 