import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'Email khong duoc de trong' })
  email: string;

  @IsNotEmpty({ message: 'UserId khong duoc de trong' })
  userId: string;

  @IsNotEmpty({ message: 'Url khong duoc de trong' })
  url: string;

  @IsNotEmpty({ message: 'Status khong duoc de trong' })
  status: string;

  @IsNotEmpty({ message: 'CompanyId khong duoc de trong' })
  companyId: string;

  @IsNotEmpty({ message: 'JobId khong duoc de trong' })
  @IsMongoId({ message: 'JobId phai la kieu ObjectId' })
  jobId: string;
}

export class CreateUserCVDto {
  @IsNotEmpty({ message: 'url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'companyId không được để trống' })
  @IsMongoId({ message: 'companyId phải là kiểu ObjectId' })
  companyId: string;

  @IsNotEmpty({ message: 'jobId không được để trống' })
  @IsMongoId({ message: 'jobId phải là kiểu ObjectId' })
  jobId: string;
}
