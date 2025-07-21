import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from 'src/uploads/entities/upload.entity'; 
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Upload)
    private documentsRepository: Repository<Upload>,
  ) {}

  async findDocumentsByTeam(teamId: string): Promise<Upload[]> {
    return this.documentsRepository.find({
      where: { teamId: teamId },
      order: { createdAt: 'DESC' }, 
    });
  }
}