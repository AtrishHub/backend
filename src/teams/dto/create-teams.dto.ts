import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
@ApiProperty({
    description: 'The name of the new team',
    example: 'Marketing Squad',
  })
  @IsString()
  @IsNotEmpty()
  teamName: string;

  @ApiProperty({
    description: 'An optional description for the team',
    example: 'Team responsible for all marketing efforts.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}