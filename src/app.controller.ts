import { Controller, Get, Render } from '@nestjs/common';
// import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { AppService } from './app.service';
// import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @Render('home')
  getHello() {
    return { name: this.appService.getName() };
  }
}
