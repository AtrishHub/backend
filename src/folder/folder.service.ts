import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from './entities/folder.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { IsNull } from 'typeorm';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepo: Repository<Folder>,
  ) {}

  async create(dto: CreateFolderDto) {
    const folder = this.folderRepo.create({ ...dto, teamId: String(dto.teamId) });
    return this.folderRepo.save(folder);
  }

  async findById(id: number) {
    const folder = await this.folderRepo.findOne({ where: { id }, relations: ['children', 'parent', 'sessions'] });
    if (!folder) throw new NotFoundException('Folder not found');
    return folder;
  }

  async findAllByTeam(teamId: string) {
    return this.folderRepo.find({ where: { teamId, parentId: IsNull() }, relations: ['children', 'sessions'] });
  }

  async update(id: number, dto: UpdateFolderDto) {
    const folder = await this.folderRepo.findOne({ where: { id } });
    if (!folder) throw new NotFoundException('Folder not found');
    Object.assign(folder, dto);
    return this.folderRepo.save(folder);
  }

  async delete(id: number) {
    const folder = await this.folderRepo.findOne({ where: { id } });
    if (!folder) throw new NotFoundException('Folder not found');
    return this.folderRepo.remove(folder);
  }

  async getFolderTree(teamId: string) {
    // Recursively fetch all folders for a team as a tree
    const roots = await this.folderRepo.find({ where: { teamId, parentId: IsNull() }, relations: ['children', 'sessions'] });
    const buildTree = async (folders: Folder[]): Promise<Folder[]> => {
      for (const folder of folders) {
        folder.children = await this.folderRepo.find({ where: { parentId: folder.id }, relations: ['children', 'sessions'] });
        if (folder.children.length > 0) {
          folder.children = await buildTree(folder.children);
        }
      }
      return folders;
    };
    return buildTree(roots);
  }
} 