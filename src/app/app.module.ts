import { Module } from '@nestjs/common';
import 'automapper-ts';

import { SharedModule } from '../shared/shared.module';
import { RabbitMessageQueue } from '../shared/mq/rabbit.mq.component';
import { LoggingService } from '../shared/logging/logging.service';
import { DatabaseService } from '../shared/database/database.service';
import { ListenerService } from '../listeners/listener.service';
import { ListenersModule } from '../listeners/listener.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ObjectId } from 'mongodb';

@Module({
      imports: [ SharedModule, ListenersModule, ScheduleModule ],
})
export class AppModule {
      constructor(private mqService: RabbitMessageQueue, private loggingService: LoggingService, private databaseService: DatabaseService, private listener: ListenerService) {}

      async onModuleInit() {
          try {
              this.loggingService.getLogger().info(`Initializing ci-schedule-service ...`);

              await this.mqService.initializeConnection();
              await this.databaseService.connect();
              await this.listener.listen();

              automapper.initialize((config: AutoMapperJs.IConfiguration) => {
                  config.createMap('ScheduleDto', 'ScheduleModel')
                        .forMember('_id', (opts: AutoMapperJs.IMemberConfigurationOptions) => new ObjectId())
                        .forMember('org_id', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.ignore())
                        .forMember('training_id', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.ignore())
                        .forMember('domains', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.ignore())
                        .forMember('standards', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.ignore())
                        .forMember('tags', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.ignore())
                        .forMember('startDate', (opts: AutoMapperJs.IMemberConfigurationOptions) => new Date(opts.sourceObject.startDate));

                  config.createMap('ScheduleModel', 'ScheduleDto');
              });

              this.loggingService.getLogger().info(`Successfully initialised ci-schedule-service`);
          } catch (e) {
              this.loggingService.getLogger().error(`Error initializing ci-schedule-service: ${e}`);
          }
      }
}
