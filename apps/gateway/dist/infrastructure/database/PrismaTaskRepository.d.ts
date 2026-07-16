import { Task, Prisma } from '@prisma/client';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
export declare class PrismaTaskRepository implements TaskRepository {
    create(data: Prisma.TaskUncheckedCreateInput): Promise<Task>;
    findById(id: string): Promise<Task | null>;
    findAllByUserId(userId: string): Promise<Task[]>;
}
