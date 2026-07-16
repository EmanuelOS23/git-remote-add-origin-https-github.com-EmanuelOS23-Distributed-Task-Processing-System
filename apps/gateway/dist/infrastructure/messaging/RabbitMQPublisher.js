"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQPublisher = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const env_1 = require("../../config/env");
const shared_1 = require("@task-system/shared");
const logger = (0, shared_1.createLogger)('RabbitMQ-Publisher');
class RabbitMQPublisher {
    static connection;
    static channel;
    // Pattern Singleton para manter uma única conexão
    static async connect() {
        if (!this.connection) {
            this.connection = await amqplib_1.default.connect(env_1.config.RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            logger.info('✅ Conectado ao RabbitMQ com sucesso');
        }
        return this.channel;
    }
    async publish(queueName, message) {
        const channel = await RabbitMQPublisher.connect();
        // Assegura que a fila existe. `durable: true` significa que a fila sobrevive a restarts do RabbitMQ.
        await channel.assertQueue(queueName, { durable: true });
        const buffer = Buffer.from(JSON.stringify(message));
        // Envia a mensagem persistente
        channel.sendToQueue(queueName, buffer, { persistent: true });
        logger.info(`Mensagem enviada para a fila [${queueName}]: ID da tarefa ${message.taskId}`);
    }
}
exports.RabbitMQPublisher = RabbitMQPublisher;
