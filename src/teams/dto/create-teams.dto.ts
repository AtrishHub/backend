import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  teamName: string;

  @IsString()
  @IsOptional()
  description?: string;
}