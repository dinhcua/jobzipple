import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './../users/schemas/user.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Permission,
  PermissionDocument,
} from '../permissions/schemas/permission.schema';
import { Role, RoleDocument } from '../roles/schemas/role.schema';
import { UsersService } from '../users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './constans';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');

    if (Boolean(isInit)) {
      const countUser = await this.userModel.countDocuments();
      const countPermission = await this.permissionModel.countDocuments();
      const countRole = await this.roleModel.countDocuments();

      // create permission
      if (!countPermission) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }

      if (!countRole) {
        const permissions = await this.permissionModel.find({}).select('_id');

        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin role',
            isActive: true,
            permissions,
          },
          {
            name: USER_ROLE,
            description: 'User role',
            isActive: true,
            permissions: [],
          },
        ]);
      }

      if (!countUser) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });
        const initPassword = this.userService.hashPassword(
          this.configService.get<string>('INIT_PASSWORD'),
        );

        await this.userModel.insertMany([
          {
            name: 'Admin',
            email: 'admin@gmail.com',
            password: initPassword,
            age: 20,
            gender: 'MALE',
            address: 'HCM',
            role: adminRole._id,
          },
          {
            name: 'User',
            email: 'cua@gmail.com',
            password: initPassword,
            age: 20,
            gender: 'MALE',
            address: 'HCM',
            role: userRole._id,
          },
        ]);
      }

      if (countPermission || countRole || countUser) {
        this.logger.log('Database is already initialized');
      }
    }
  }
}
