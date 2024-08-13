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
// import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { IUser } from '../users/users.interface';
import { User } from '../decorators/request-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @ResponseMessage(LOGIN_SUCCESS)
  @Public()
  @Post('login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Get('account')
  getAccount(@User() user: IUser) {
    return user;
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
