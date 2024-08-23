import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: MongooseHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  healthCheck() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
