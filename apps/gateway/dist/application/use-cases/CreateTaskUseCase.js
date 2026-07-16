"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskUseCase = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().optional(),
    payload: zod_1.z.any().optional(), // Payload que será processado pelo worker
});
class CreateTaskUseCase {
    taskRepository;
    messagePublisher;
    constructor(taskRepository, messagePublisher) {
        this.taskRepository = taskRepository;
        this.messagePublisher = messagePublisher;
    }
    async execute(userId, data) {
        // 1. Cria a tarefa no banco como 'PENDING'
        const task = await this.taskRepository.create({
            title: data.title,
            description: data.description || null,
            payload: data.payload || null,
            userId,
        });
        // 2. Enfileira a tarefa no RabbitMQ
        await this.messagePublisher.publish('tasks_queue', {
            taskId: task.id,
            userId: userId,
            payload: task.payload,
        });
        return task;
    }
}
exports.CreateTaskUseCase = CreateTaskUseCase;
