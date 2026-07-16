import { Task, Prisma } from '@prisma/client';
export interface TaskRepository {
    create(data: Prisma.TaskUncheckedCreateInput): Promise<Task>;
    findById(id: string): Promise<Task | null>;
    findAllByUserId(userId: string): Promise<Task[]>;
}
