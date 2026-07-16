import { createLogger } from '@task-system/shared';
import { RabbitMQConsumer } from './infrastructure/messaging/RabbitMQConsumer';
import { PrismaWorkerTaskRepository } from './infrastructure/database/PrismaWorkerTaskRepository';
import { TaskProcessorService } from './application/services/TaskProcessorService';

const logger = createLogger('Worker-Bootstrap');

async function bootstrap() {
  logger.info('🚀 Inicializando Worker Service...');

  const repository = new PrismaWorkerTaskRepository();
  const processor = new TaskProcessorService(repository);
  const consumer = new RabbitMQConsumer(processor);

  // Inicia o loop infinito de consumo
  await consumer.startListening('tasks_queue');
}

bootstrap().catch(err => {
  logger.error(`Erro fatal no Worker: ${err}`);
  process.exit(1);
});
