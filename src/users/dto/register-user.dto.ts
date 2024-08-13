import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsString()
  email: string;

  @IsNotEmpty({
    message: 'Password is required',
  })
  @IsString()
  password: string;

  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty({
    message: 'Age is required',
  })
  age: number;

  @IsString()
  @IsNotEmpty({
    message: 'Address is required',
  })
  address: string;

  @IsString()
  @IsNotEmpty({
    message: 'Gender is required',
  })
  gender: string;
}
