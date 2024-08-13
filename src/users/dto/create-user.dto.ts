import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
import { RegisterUserDto } from './register-user.dto';

class CompanyDto {
  @IsString()
  @IsNotEmpty({
    message: 'Id is required',
  })
  _id: mongoose.Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;
}

export class CreateUserDto extends RegisterUserDto {
  @IsString()
  @IsNotEmpty({
    message: 'Role is required',
  })
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}
