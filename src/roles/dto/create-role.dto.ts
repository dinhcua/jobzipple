import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNotEmpty({ message: 'Permissions is required' })
  @IsMongoId({
    each: true,
    message: 'Permissions must be an array of valid MongoId',
  })
  @IsArray({ message: 'Permissions must be an array of MongoId' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
