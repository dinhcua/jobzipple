import { BadRequestException, Injectable } from '@nestjs/common';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from '../users/users.interface';
import { CreateUserCVDto } from './dto/create-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TResumeQuery } from '../types/query';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '../constants';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name)
    private readonly resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}
  async create(createUserCVDto: CreateUserCVDto, user: IUser) {
    const { url, companyId, jobId } = createUserCVDto;

    const { email, _id } = user;

    const newCV = await this.resumeModel.create({
      url,
      companyId,
      jobId,
      userId: _id,
      email,
      status: 'PENDING',
      createdBy: {
        email,
        _id,
      },
      history: [
        {
          status: 'PENDING',
          createdAt: new Date(),
          createdBy: {
            email,
            _id,
          },
        },
      ],
    });
    if (!newCV) {
      throw new BadRequestException('Failed to create new CV');
    }

    return {
      id: newCV._id,
      createdAt: newCV.createdAt,
    };
  }

  async findAll(query: TResumeQuery) {
    const {
      pageSize = DEFAULT_PAGE_LIMIT,
      current = DEFAULT_PAGE,
      populate,
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

    const filter = searchByFilter(['jodId']);

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
    const totalItems = await this.resumeModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / +pageSize);

    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .populate([
        { path: 'companyId', select: ['name', 'logo', '_id'] },
        { path: 'jobId', select: ['title', 'description', '_id'] },
      ])
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    return this.resumeModel.findById({ _id: id });
  }

  update(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const updatedCV = this.resumeModel.findOneAndUpdate(
      {
        _id: id,
        email: user.email,
      },
      {
        status,
        $push: {
          history: {
            status,
            createdAt: new Date(),
            createdBy: {
              email: user.email,
              _id: user._id,
            },
          },
        },
      },
    );

    return updatedCV;
  }

  getResumesByUser(user: IUser) {
    return this.resumeModel.find({ email: user.email });
  }

  remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    return this.resumeModel.updateOne(
      {
        _id: id,
        email: user.email,
      },
      {
        history: {
          status: 'DELETED',
          createdAt: new Date(),
          createdBy: {
            email: user.email,
            _id: user._id,
          },
        },
        deletedAt: new Date(),
        deleted: true,
        deletedBy: {
          email: user.email,
          _id: user._id,
        },
      },
    );
  }
}
