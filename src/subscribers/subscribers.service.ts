import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from '../users/users.interface';
import { TSubscriberQuery } from '../types/query';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '../constants';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const isExistEmail = this.subscriberModel.exists({
      email: createSubscriberDto.email,
    });

    if (isExistEmail) {
      throw new BadRequestException('Email already exists');
    }

    return this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: TSubscriberQuery) {
    const {
      pageSize = DEFAULT_PAGE_LIMIT,
      current = DEFAULT_PAGE,
      populate,
      fields,
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
    const totalItems = await this.subscriberModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / +pageSize);

    const populateFields = populate
      ? populate.split(',').map((p: string) => {
          const select = [];

          fields.split(',').map((a) => {
            const [path, sel] = a.split('.');
            if (path === p) {
              select.push(sel);
            }
          });

          return { path: p, select };
        })
      : [];

    const result = await this.subscriberModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .populate(populateFields)
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
    return this.subscriberModel.findById(id);
  }

  update(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    const isExistEmail = this.subscriberModel.exists({
      _id: { $ne: id },
      email: updateSubscriberDto.email,
    });

    if (isExistEmail) {
      throw new BadRequestException('Email already exists');
    }

    return this.subscriberModel.updateOne(
      { _id: id },
      {
        ...updateSubscriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  remove(id: string, user: IUser) {
    return this.subscriberModel.findOneAndUpdate(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
        deleted: true,
        deleteAt: new Date(),
      },
    );
  }
}
