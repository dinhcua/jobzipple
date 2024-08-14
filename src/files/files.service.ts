import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  getRootPath() {
    return process.cwd();
  }
  private readonly uploadPath = path.join(this.getRootPath(), 'public/images');

  async deleteFile(folder: any, filename: string) {
    const filePath = path.join(this.uploadPath, folder, filename);
    const fileExists = await fs.existsSync(filePath);
    if (!fileExists) {
      throw new BadRequestException('File not found');
    }
    await fs.unlinkSync(filePath);
  }
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
