import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permission } from '../../permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  permissions: {
    _id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];

  @Prop()
  createdAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  deletedAt: Date;

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  deleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
