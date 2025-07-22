import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { Upload } from './entities/upload.entity';
import { TeamsModule } from 'src/teams/teams.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Upload]),
    TeamsModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}