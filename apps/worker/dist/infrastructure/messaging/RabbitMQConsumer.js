"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQConsumer = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const env_1 = require("../../config/env");
const shared_1 = require("@task-system/shared");
const logger = (0, shared_1.createLogger)('RabbitMQ-Consumer');
class RabbitMQConsumer {
    taskProcessor;
    connection;
    channel;
    constructor(taskProcessor) {
        this.taskProcessor = taskProcessor;
    }
    async startListening(queueName) {
        try {
            this.connection = await amqplib_1.default.connect(env_1.config.RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(queueName, { durable: true });
            // O prefetch garante que o worker puxe apenas 1 tarefa por vez,
            // evitando consumo excessivo de memória sob carga extrema.
            this.channel.prefetch(1);
            logger.info(`📥 Aguardando mensagens na fila [${queueName}]...`);
            this.channel.consume(queueName, async (msg) => {
                if (msg) {
                    const content = msg.content.toString();
                    const { taskId, payload } = JSON.parse(content);
                    try {
                        await this.taskProcessor.processTask(taskId, payload);
                    }
                    catch (err) {
                        logger.error(`Erro crítico e não tratado na execução do worker: ${err}`);
                    }
                    finally {
                        // Independente de sucesso ou falha na regra de negócio (gerenciada via try/catch interno),
                        // informamos ao RabbitMQ que a mensagem foi processada (ack).
                        // Caso contrário a mensagem ficaria "unacked" e seria reprocessada infinitamente.
                        this.channel.ack(msg);
                    }
                }
            });
        }
        catch (error) {
            logger.error(`Erro de conexão com o RabbitMQ: ${error}`);
            process.exit(1);
        }
    }
}
exports.RabbitMQConsumer = RabbitMQConsumer;
