import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { RabbitMessageQueue } from '../shared/mq/rabbit.mq.component';
import { LoggingService } from '../shared/logging/logging.service';
import { DatabaseService } from '../shared/database/database.service';
import { ListenerService } from '../listeners/listener.service';
import { ListenersModule } from '../listeners/listener.module';
import 'automapper-ts';

@Module({
      imports: [ SharedModule ],
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
                  config.createMap('ProgramDto', 'ProgramModel')
                        .forMember('schedules', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.sourceObject.schedules.forEach(schedule => schedule.startDate = new Date(schedule.startDate)));

                  config.createMap('ProgramModel', 'ProgramDto');
              });

              this.loggingService.getLogger().info(`Successfully initialised ci-schedule-service`);
          } catch (e) {
              this.loggingService.getLogger().error(`Error initializing ci-schedule-service: ${e}`);
          }
      }
}
