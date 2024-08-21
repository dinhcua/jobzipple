import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateUserCVDto } from './dto/create-resume.dto';
import { IUser } from '../users/users.interface';
import { User } from '../decorators/request-user.decorator';
import { TResumeQuery } from '../types/query';
import { Public } from '../decorators/public.decorator';

@Controller('resumes')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  create(@Body() createUserCVDto: CreateUserCVDto, @User() user: IUser) {
    return this.resumeService.create(createUserCVDto, user);
  }

  @Get()
  @Public()
  findAll(@Query() query: TResumeQuery) {
    return this.resumeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('status') status: string,
    @User() user: IUser,
  ) {
    return this.resumeService.update(id, status, user);
  }

  @Post('by-user')
  getResumesByUser(@User() user: IUser) {
    return this.resumeService.getResumesByUser(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumeService.remove(id, user);
  }
}
