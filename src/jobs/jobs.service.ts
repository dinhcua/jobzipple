import { TJobQuery } from './../types/query';
import { Injectable } from '@nestjs/common';
import { SoftDeleteModel } from 'mongoose-delete';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { IUser } from '../users/users.interface';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '../constants';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private readonly jobsModel: SoftDeleteModel<JobDocument>,
  ) {}

  create(createJobDto: CreateJobDto, user: IUser) {
    return this.jobsModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: TJobQuery) {
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
    const totalItems = await this.jobsModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / +pageSize);

    const result = await this.jobsModel
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

  findOne(id: string) {
    return this.jobsModel.findById(id);
  }

  update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    return this.jobsModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string, user: IUser) {
    return this.jobsModel.updateOne(
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
