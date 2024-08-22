import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from '../users/users.interface';
import { TCompanyQuery } from '../types/query';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '../constants';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query?: TCompanyQuery) {
    const {
      pageSize = DEFAULT_PAGE_LIMIT,
      current = DEFAULT_PAGE,
      sort,
    } = query;

    const searchByFilter = (filterFields: string[]) => {
      return filterFields.reduce((acc, field) => {
        if (query[field]) {
          return {
            ...acc,
            [field]: { $regex: query[field], $options: 'i' },
          };
        }
        return acc;
      }, {});
    };

    const filter = searchByFilter(['name', 'address']);

    let softBy = {};
    if (sort) {
      const isDesc = sort.startsWith('-');
      const sortKey = sort.replace('-', '');

      softBy = {
        [sortKey]: isDesc ? -1 : 1,
      };
    }

    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize || 10;
    const totalItems = await this.companyModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / +pageSize);

    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(softBy)
      .exec();

    return {
      result,
      meta: {
        totalItems,
        totalPages,
        currentPage: +current,
      },
    };
  }

  async findOne(id: string) {
    const company = await this.companyModel.findOne({
      _id: id,
    });

    if (!company) {
      throw new BadRequestException('Company not found');
    }

    return company;
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return this.companyModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string, user: IUser) {
    // soft delete
    return this.companyModel.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }
}
