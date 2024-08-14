import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';

class CompanyDto {
  @IsNotEmpty({
    message: 'Id is required',
  })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({
    message: 'Title is required',
  })
  name: string;

  @IsNotEmpty({
    message: 'Skills is required',
  })
  @IsArray({ message: 'Skills must be an array' })
  @IsString({ each: true, message: 'Each skill must be a string' })
  skills: string[];

  @IsNotEmpty({
    message: 'Salary is required',
  })
  salary: number;

  @IsNotEmpty({
    message: 'Quantity is required',
  })
  quantity: number;

  @IsNotEmpty({
    message: 'Level is required',
  })
  level: string;

  @IsNotEmpty({
    message: 'Location is required',
  })
  location: string;

  @IsNotEmpty({
    message: 'Description is required',
  })
  description: string;

  @IsNotEmptyObject()
  @IsObject()
  @Type(() => CompanyDto)
  company: CompanyDto;
}
