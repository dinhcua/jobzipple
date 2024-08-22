import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './schemas/role.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }])],
  controllers: [RolesController],
  exports: [RolesService],
  providers: [RolesService],
})
export class RolesModule {}
