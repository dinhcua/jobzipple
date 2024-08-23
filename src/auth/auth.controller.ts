import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LOGIN_SUCCESS } from '../constants/response.constants';
import { Public } from '../decorators/public.decorator';
import { ResponseMessage } from '../decorators/responce-message.decorator';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { IUser } from '../users/users.interface';
import { User } from '../decorators/request-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import { RolesService } from '../roles/roles.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from '../users/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  // @UseGuards(ThrottlerGuard)
  @UseGuards(LocalAuthGuard)
  @ResponseMessage(LOGIN_SUCCESS)
  @ApiBody({ type: UserLoginDto })
  @Public()
  @Post('login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Get('account')
  async getAccount(@User() user: IUser) {
    const temp = await this.rolesService.findOne(user.role._id);
    user.permissions = temp.permissions;
    return { user };
  }

  @Public()
  @Get('refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];

    return this.authService.refresh(refreshToken, response);
  }

  @ResponseMessage('Logout success')
  @Post('logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
