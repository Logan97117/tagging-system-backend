import { TagsActionMessage } from '@app/common';
import { RabbitMQSubscriberService } from '@app/common';
import { RABBITMQ_CLIENT } from '@app/common';
import { RabbitMQSubscriberCallback } from '@app/common';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_VAR_NAMES } from '../../item-tag-db-consumer.const';

@Injectable()
export class ItemTagAdditionHanlder implements OnModuleInit {
  private readonly logger = new Logger(ItemTagAdditionHanlder.name);
  private readonly rabbitMqSubscriberService: RabbitMQSubscriberService;
  private readonly configService: ConfigService;
  constructor(
    @Inject(RABBITMQ_CLIENT)
    rabbitMqSubscriberService: RabbitMQSubscriberService,
    configService: ConfigService,
  ) {
    this.rabbitMqSubscriberService = rabbitMqSubscriberService;
    this.configService = configService;
  }

  async onModuleInit() {
    const subsriberCallback = new RabbitMQSubscriberCallback<TagsActionMessage>(
      this.onReceiveMessage.bind(this),
    );
    const tagsAdditionQueueName = this.configService.get(
      ENV_VAR_NAMES.TAG_ADDITION_QUEUE_NAME,
    );
    this.logger.log(`Subscribing to ${tagsAdditionQueueName}`);
    try {
      await this.rabbitMqSubscriberService.subscribeToQueue<TagsActionMessage>(
        tagsAdditionQueueName,
        subsriberCallback,
      );
    } catch (ex) {
      this.logger.error(`Failed to subscribe to ${tagsAdditionQueueName}`);
      this.logger.error(ex);
    }
  }

  async onReceiveMessage(message: TagsActionMessage): Promise<void> {
    this.logger.log(message);
  }
}
