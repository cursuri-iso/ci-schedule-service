import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

import { Listener } from './listener';
import { RabbitMessageQueue } from '../shared/mq/rabbit.mq.component';
import { LoggingService } from '../shared/logging/logging.service';

@Injectable()
export class ListenerService {
    private listeners: Listener[] = [];
    private logger: winston.Logger;

    constructor(private mq: RabbitMessageQueue, private loggingService: LoggingService) {
        this.logger = this.loggingService.getLogger();
        this.initialiseListeners();
    }

    private initialiseListeners(): void {
        // to be added
    }

    public async listen(): Promise<void> {
        await Promise.all(this.listeners.map(listener => this.mq.listenToQueue(listener)));
    }
}
