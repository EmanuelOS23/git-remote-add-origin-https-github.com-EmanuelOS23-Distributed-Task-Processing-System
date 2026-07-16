import { z } from 'zod';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { RabbitMQPublisher } from '../../infrastructure/messaging/RabbitMQPublisher';
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    payload: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description?: string | undefined;
    payload?: any;
}, {
    title: string;
    description?: string | undefined;
    payload?: any;
}>;
type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export declare class CreateTaskUseCase {
    private taskRepository;
    private messagePublisher;
    constructor(taskRepository: TaskRepository, messagePublisher: RabbitMQPublisher);
    execute(userId: string, data: CreateTaskDTO): Promise<{
        status: import(".prisma/client").$Enums.TaskStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        payload: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
    }>;
}
export {};
