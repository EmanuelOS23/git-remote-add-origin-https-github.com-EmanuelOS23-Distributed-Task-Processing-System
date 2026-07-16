import { z } from 'zod';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { RabbitMQPublisher } from '../../infrastructure/messaging/RabbitMQPublisher';

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  payload: z.any().optional(), // Payload que será processado pelo worker
});

type CreateTaskDTO = z.infer<typeof createTaskSchema>;

export class CreateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private messagePublisher: RabbitMQPublisher
  ) {}

  async execute(userId: string, data: CreateTaskDTO) {
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
