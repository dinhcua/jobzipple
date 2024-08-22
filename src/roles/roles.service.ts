import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { RoleDocument } from './schemas/role.schema';
import { IUser } from '../users/users.interface';
import { TRoleQuery } from '../types/query';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '../constants';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel('Role')
    private readonly roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const isNameExist = await this.roleModel.findOne({
      name: createRoleDto.name,
    });

    if (isNameExist) {
      throw new BadRequestException('Role name already exists');
    }

    return this.roleModel.create({
      ...createRoleDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: TRoleQuery) {
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
    const totalItems = await this.roleModel.find(filter).countDocuments();
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

    const result = await this.roleModel
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid role id');
    }

    return this.roleModel
      .findById(id)
      .populate({
        path: 'permissions',
        select: { _id: 1, apiPath: 1, name: 1, method: 1 },
      })
      .exec();
  }

  update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    return this.roleModel.findByIdAndUpdate(
      id,
      {
        ...updateRoleDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true },
    );
  }

  remove(id: string, user: IUser) {
    return this.roleModel.findByIdAndUpdate(
      id,
      {
        deleted: true,
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      { new: true },
    );
  }
}
