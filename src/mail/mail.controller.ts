import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Public } from '../decorators/public.decorator';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import {
  Subscriber,
  SubscriberDocument,
} from '../subscribers/schemas/subscriber.schema';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailerService: MailerService,

    @InjectModel(Job.name)
    private readonly jobModel: SoftDeleteModel<JobDocument>,

    @InjectModel(Subscriber.name)
    private readonly subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // testCron() {
  //   console.log('Every 5 seconds');
  // }

  @Public()
  @Get()
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find({});
    return await Promise.all(
      subscribers.map(async (subscriber) => {
        const jobMatchingWithSkills = await this.jobModel.find({
          skills: { $in: subscriber.skills },
        });

        const jobs = jobMatchingWithSkills.map((job) => {
          return {
            name: job.name,
            company: job.company.name,
            salary: job.salary,
            skills: job.skills,
          };
        });

        if (jobMatchingWithSkills.length) {
          await this.mailerService.sendMail({
            to: 'luongdinhcua2512@gmail.com',
            from: 'support team',
            subject: 'Test email',
            template: 'job',
            context: {
              name: subscriber.name,
              jobs,
            },
          });
        }
      }),
    );
  }
}
