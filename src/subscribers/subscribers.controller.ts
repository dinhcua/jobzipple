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
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { User } from '../decorators/request-user.decorator';
import { IUser } from '../users/users.interface';
import { Public } from '../decorators/public.decorator';
import { TSubscriberQuery } from '../types/query';
// import { SkipPermission } from '../decorators/skip-permission.decorator';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  create(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Public()
  @Get()
  findAll(@Query() query: TSubscriberQuery) {
    return this.subscribersService.findAll(query);
  }

  @Post('skills')
  findOne(@User() user: IUser) {
    return this.subscribersService.findOne(user);
  }

  @Patch()
  update(
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
