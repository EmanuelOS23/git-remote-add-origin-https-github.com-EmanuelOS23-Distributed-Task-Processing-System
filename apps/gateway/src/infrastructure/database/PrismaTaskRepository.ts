import { PrismaClient, Task, Prisma } from '@prisma/client';
import { TaskRepository } from '../../domain/repositories/TaskRepository';

const prisma = new PrismaClient();

export class PrismaTaskRepository implements TaskRepository {
  async create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    return prisma.task.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  }

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
      include: { logs: true }, // Inclui os logs de execução para visualização
    });
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
