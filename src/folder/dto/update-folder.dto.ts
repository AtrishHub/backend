import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateFolderDto {
  @ApiProperty({
    description: 'The new name for the folder',
    example: 'Q4 Marketing Reports',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The new description for the folder',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;


  @ApiProperty({
    description: 'The new parent folder ID to move the folder',
    example: '47910454-619d-4bd6-b31a-1b4dd1e2598c',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;
} 