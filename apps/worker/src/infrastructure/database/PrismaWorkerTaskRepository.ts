import { PrismaClient, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaWorkerTaskRepository {
  /**
   * Atualiza o status da tarefa principal.
   */
  async updateStatus(taskId: string, status: TaskStatus): Promise<void> {
    await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }

  /**
   * Cria uma entrada na tabela de Logs (histórico/rastreabilidade da tarefa).
   */
  async createLog(taskId: string, status: TaskStatus, message: string): Promise<void> {
    await prisma.taskLog.create({
      data: {
        taskId,
        status,
        message,
      },
    });
  }
}
