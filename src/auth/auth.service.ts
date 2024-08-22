import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/users.interface';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { Response } from 'express';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private roleService: RolesService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user && this.usersService.isValidPassword(pass, user.password)) {
      const userRole = user.role as unknown as { _id: string; name: string };
      const temp = await this.roleService.findOne(userRole._id);

      const objUser = {
        ...user.toObject(),
        permissions: temp?.permissions ?? [],
      };

      delete objUser.password;

      return objUser;
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const refreshToken = await this.createRefreshToken(payload);

    await this.usersService.updateRefreshToken(user._id, refreshToken);

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const newUser = await this.usersService.register(registerUserDto);
    delete newUser.password;
    return newUser;
  }

  createRefreshToken(payload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      expiresIn: '30d',
    });

    return refreshToken;
  }

  async refresh(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });

      const user = await this.usersService.findUserByToken(refreshToken);

      if (!user) {
        throw new BadRequestException('Invalid refresh token');
      }

      const { _id, email, name, role } = user;

      const payload = {
        sub: 'token refresh',
        iss: 'from server',
        email,
        name,
        role,
        _id,
      };

      const newRefreshToken = await this.createRefreshToken(payload);

      await this.usersService.updateRefreshToken(
        _id.toString(),
        newRefreshToken,
      );

      response.clearCookie('refresh_token');
      response.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          _id,
          email,
          name,
          role,
        },
      };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async logout(response: Response, user: IUser) {
    await this.usersService.updateRefreshToken(user._id, '');
    response.clearCookie('refresh_token');
    return 'Logout success';
  }
}
