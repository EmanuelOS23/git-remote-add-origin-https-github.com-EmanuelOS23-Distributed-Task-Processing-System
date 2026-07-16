import amqp, { Connection, Channel } from 'amqplib';
import { config } from '../../config/env';
import { createLogger } from '@task-system/shared';

const logger = createLogger('RabbitMQ-Publisher');

export class RabbitMQPublisher {
  private static connection: any;
  private static channel: any;

  // Pattern Singleton para manter uma única conexão
  static async connect(): Promise<any> {
    if (!this.connection) {
      this.connection = await amqp.connect(config.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      logger.info('✅ Conectado ao RabbitMQ com sucesso');
    }
    return this.channel;
  }

  async publish(queueName: string, message: any): Promise<void> {
    const channel = await RabbitMQPublisher.connect();
    
    // Assegura que a fila existe. `durable: true` significa que a fila sobrevive a restarts do RabbitMQ.
    await channel.assertQueue(queueName, { durable: true });
    
    const buffer = Buffer.from(JSON.stringify(message));
    
    // Envia a mensagem persistente
    channel.sendToQueue(queueName, buffer, { persistent: true });
    logger.info(`Mensagem enviada para a fila [${queueName}]: ID da tarefa ${message.taskId}`);
  }
}
