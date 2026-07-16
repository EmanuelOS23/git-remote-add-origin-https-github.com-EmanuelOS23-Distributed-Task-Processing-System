import { TaskStatus } from '@prisma/client';
export declare class PrismaWorkerTaskRepository {
    /**
     * Atualiza o status da tarefa principal.
     */
    updateStatus(taskId: string, status: TaskStatus): Promise<void>;
    /**
     * Cria uma entrada na tabela de Logs (histórico/rastreabilidade da tarefa).
     */
    createLog(taskId: string, status: TaskStatus, message: string): Promise<void>;
}
