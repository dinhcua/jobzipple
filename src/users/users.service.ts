import { ADMIN_ROLE, USER_ROLE } from './../databases/constans';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from './users.interface';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { NotFoundError } from 'rxjs';
import { TUserQuery } from '../types/query';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '../constants';
import { Role, RoleDocument } from '../roles/schemas/role.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  hashPassword(plainPassword: string) {
    const salt = genSaltSync(10);
    return hashSync(plainPassword, salt);
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExist = await this.userModel.exists({
      email: createUserDto.email,
    });
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    const { email, age, gender, name, role, company, address, password } =
      createUserDto;

    const hashedPassword = this.hashPassword(password);
    const newUser = await this.userModel.create({
      email,
      age,
      gender,
      name,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
      password: hashedPassword,
    });
    const result = newUser.toObject();
    delete result.password;

    return result;
  }

  async register(registerUserDto: RegisterUserDto) {
    const isExist = await this.userModel.exists({
      email: registerUserDto.email,
    });
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }
    const { email, age, gender, name, address, password } = registerUserDto;
    const hashedPassword = this.hashPassword(password);

    const userRole = await this.roleModel.findOne({ role: USER_ROLE });

    const newUser = await this.userModel.create({
      email,
      age,
      gender,
      name,
      address,
      role: userRole._id,
      password: hashedPassword,
    });
    const result = newUser.toObject();
    delete result.password;

    return result;
  }

  async findAll(query?: TUserQuery) {
    const {
      pageSize = DEFAULT_PAGE_LIMIT,
      current = DEFAULT_PAGE,
      sort,
    } = query;

    let softBy = {};
    let filter = {};
    if (query) {
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

      filter = searchByFilter(['name', 'address']);

      if (query['company._id']) {
        filter['company._id'] = query['company._id'];
      }

      if (sort) {
        const isDesc = sort.startsWith('-');
        const sortKey = sort.replace('-', '');

        softBy = {
          [sortKey]: isDesc ? -1 : 1,
        };
      }
    }

    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize || 10;
    const totalItems = await this.userModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / +pageSize);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .select('-password')
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
    const user = this.userModel.findById({ _id: id }).select('-password');

    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async findOneByUserName(username: string) {
    const user = await this.userModel.findOne({ email: username }).populate({
      path: 'role',
      select: { name: 1 },
    });
    return user;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    const userWantRemove = (await this.userModel.findById(id).populate({
      path: 'role',
      select: { name: 1 },
    })) as any;

    if (userWantRemove?.role?.name === ADMIN_ROLE) {
      throw new BadRequestException('Cannot delete admin role');
    }

    return this.userModel.updateOne(
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

  restore(id: string) {
    return this.userModel.restore({
      _id: id,
    });
  }

  updateRefreshToken(_id: string, refreshToken: string) {
    return this.userModel.updateOne(
      { _id },
      {
        refreshToken: refreshToken,
      },
    );
  }

  findUserByToken = async (refreshToken: string) => {
    return this.userModel.findOne({
      refreshToken,
    });
  };
}
