import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { SoftDeleteModel } from 'mongoose-delete';
import { PermissionDocument } from './schemas/permission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../users/users.interface';
import { TPermissionQuery } from '../types/query';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '../constants';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel('Permission')
    private readonly permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}
  create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method } = createPermissionDto;
    const permissionExited = this.permissionModel.findOne({
      apiPath,
      method,
    });

    if (permissionExited) {
      throw new BadRequestException(
        'Permission with the same apiPath and method already exists',
      );
    }

    return this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async findAll(query: TPermissionQuery) {
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
    const totalItems = await this.permissionModel.find(filter).countDocuments();
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

    const result = await this.permissionModel
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
    return this.permissionModel.findById({ _id: id });
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    const { apiPath, method } = updatePermissionDto;
    const permissionExited = this.permissionModel.findOne({
      apiPath,
      method,
    });

    if (permissionExited) {
      throw new BadRequestException(
        'Permission with the same apiPath and method already exists',
      );
    }

    return this.permissionModel.findByIdAndUpdate(
      { _id: id },
      {
        ...updatePermissionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
      {
        new: true,
      },
    );
  }

  remove(id: string, user: IUser) {
    return this.permissionModel.updateOne(
      { _id: id },
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
