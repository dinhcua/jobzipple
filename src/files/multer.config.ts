import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath() {
    return process.cwd();
  }

  async ensureExists(targetDirectory: string) {
    await fs.mkdirSync(targetDirectory, { recursive: true });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const folder = req?.headers?.folder_type ?? 'default';
          await this.ensureExists(`public/images/${folder}`);

          cb(null, path.join(this.getRootPath(), `public/images/${folder}`));
        },
        filename: (req, file, cb) => {
          const extName = path.extname(file.originalname);

          const baseName = path.basename(file.originalname, extName);

          const finalName = `${baseName}-${Date.now()}${extName}`;

          cb(null, finalName);
        },
      }),
    };
  }
}
