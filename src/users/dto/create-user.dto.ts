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
import { ApiProperty } from '@nestjs/swagger';

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

export class UserLoginDto {
  @IsString()
  @IsNotEmpty({
    message: 'Email is required',
  })
  @ApiProperty({ example: 'cua@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password is required',
  })
  @ApiProperty({ example: '123456' })
  password: string;
}
