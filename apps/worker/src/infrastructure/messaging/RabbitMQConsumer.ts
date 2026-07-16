import amqp, { Connection, Channel } from 'amqplib';
import { config } from '../../config/env';
import { createLogger } from '@task-system/shared';
import { TaskProcessorService } from '../../application/services/TaskProcessorService';

const logger = createLogger('RabbitMQ-Consumer');

export class RabbitMQConsumer {
  private connection!: any;
  private channel!: any;

  constructor(private taskProcessor: TaskProcessorService) {}

  async startListening(queueName: string) {
    try {
      this.connection = await amqp.connect(config.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      
      await this.channel.assertQueue(queueName, { durable: true });
      
      // O prefetch garante que o worker puxe apenas 1 tarefa por vez,
      // evitando consumo excessivo de memória sob carga extrema.
      this.channel.prefetch(1);

      logger.info(`📥 Aguardando mensagens na fila [${queueName}]...`);

      this.channel.consume(queueName, async (msg: amqp.ConsumeMessage | null) => {
        if (msg) {
          const content = msg.content.toString();
          const { taskId, payload } = JSON.parse(content);
          
          try {
            await this.taskProcessor.processTask(taskId, payload);
          } catch (err) {
            logger.error(`Erro crítico e não tratado na execução do worker: ${err}`);
          } finally {
            // Independente de sucesso ou falha na regra de negócio (gerenciada via try/catch interno),
            // informamos ao RabbitMQ que a mensagem foi processada (ack).
            // Caso contrário a mensagem ficaria "unacked" e seria reprocessada infinitamente.
            this.channel.ack(msg);
          }
        }
      });
    } catch (error) {
      logger.error(`Erro de conexão com o RabbitMQ: ${error}`);
      process.exit(1);
    }
  }
}
