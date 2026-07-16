"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("@task-system/shared");
const RabbitMQConsumer_1 = require("./infrastructure/messaging/RabbitMQConsumer");
const PrismaWorkerTaskRepository_1 = require("./infrastructure/database/PrismaWorkerTaskRepository");
const TaskProcessorService_1 = require("./application/services/TaskProcessorService");
const logger = (0, shared_1.createLogger)('Worker-Bootstrap');
async function bootstrap() {
    logger.info('🚀 Inicializando Worker Service...');
    const repository = new PrismaWorkerTaskRepository_1.PrismaWorkerTaskRepository();
    const processor = new TaskProcessorService_1.TaskProcessorService(repository);
    const consumer = new RabbitMQConsumer_1.RabbitMQConsumer(processor);
    // Inicia o loop infinito de consumo
    await consumer.startListening('tasks_queue');
}
bootstrap().catch(err => {
    logger.error(`Erro fatal no Worker: ${err}`);
    process.exit(1);
});
