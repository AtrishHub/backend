import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';


export class CreateUploadDto {
  filename: string;
  filepath: string;
  mimetype: string;
  teamId: string;
  creatorId: string;
}

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  async create(createUploadDto: CreateUploadDto): Promise<Upload> {
    const newUpload = this.uploadRepository.create(createUploadDto);
    return this.uploadRepository.save(newUpload);
  }
}