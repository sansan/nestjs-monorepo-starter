import { Module, OnModuleInit } from '@nestjs/common';

import { CronService, QueueService } from '@nest-starter/core';

import { AppController } from './app/app.controller';
import { SharedModule } from './app/shared/shared.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { TestingModule } from './app/testing/testing.module';

@Module({
  imports: [
    SharedModule,
    TestingModule,
    SharedModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: CronService,
      useFactory: () => {
        return new CronService({
          mongoUrl: process.env.MONGO_URL
        });
      }
    }
  ]
})
export class AppModule implements OnModuleInit {
  constructor(
    private queueService: QueueService,
    private cronService: CronService
  ) {

  }

  async onModuleInit() {
    this.cronService.initialize().then(async () => {
      this.cronService.define('demo_cron_job', async (job, done) => {
        done();
      });

      await this.cronService.processEvery('demo_cron_job', '5 minutes');
    });

    this.queueService.demoQueue.process(5, async (job) => {
      // Demo queue processing
    });
  }
}