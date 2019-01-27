import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import * as winston from 'winston';

import { Listener } from '../../listeners/listener';

@Injectable()
export class RabbitMessageQueue {
    private conn: amqp.Connection;

    private channel: amqp.Channel;

    constructor(private options: any, private logger: winston.Logger) { }

    public async initializeConnection(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            let connectionAttempts: number = 1;
            let connected: boolean = false;

            while (connectionAttempts <= this.options.retryCount && ! connected) {
                try {
                    this.conn = await amqp.connect(this.options.url);
                    this.channel = await this.conn.createChannel();
                    connected = true;

                    this.logger.info(`Successfully connected to RabbitMQ after ${connectionAttempts} tries.`);
                    resolve();
                } catch (error) {
                    if (connectionAttempts < this.options.retryCount) {
                        this.logger.warn(`Attempt ${connectionAttempts} failed (error:${error}), waiting another ${this.options.retryTimeout} seconds ...`);

                        connectionAttempts ++;
                        await this.delay(parseInt(this.options.retryTimeout, 10) * 1000);
                    } else {
                        this.logger.error(`Failed to connect to RabbitMq`);
                        reject();
                    }
                }
            }
        });
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public async listenToQueue(listener: Listener): Promise<boolean> {
        const queueAssert = await this.channel.assertQueue(listener.queueName);

        if (queueAssert.queue) {
            await this.channel.bindQueue(listener.queueName, this.options.exchange, listener.patternString);

            this.channel.consume(listener.queueName, (async (msg: amqp.Message) => {
                const result = await listener.onMessageReceived(msg);
                result ? this.channel.ack(msg) : this.channel.nack(msg);
            }));

            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    public async publishMessage(message: { routingKey: string, content: any, options: amqp.Options.Publish }): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let result = false;

            try {
                result = this.channel.publish(this.options.exchange, message.routingKey, new Buffer(JSON.stringify(message.content)), message.options);
                this.logger.info(`Successfully published message: `, message);

                resolve(result);
            } catch (err) {
                this.logger.error(`Error publishing message on ${message.routingKey}: ${err}`);
                reject(err);
            }
        });
    }
}
