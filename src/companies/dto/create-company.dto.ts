import { IsNotEmpty } from 'class-validator';
export class CreateCompanyDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsNotEmpty({
    message: 'Description is required',
  })
  description: string;

  @IsNotEmpty({
    message: 'Address is required',
  })
  address: string;

  @IsNotEmpty({
    message: 'Location is required',
  })
  location: string;
}
