import { PrismaWorkerTaskRepository } from '../../infrastructure/database/PrismaWorkerTaskRepository';
export declare class TaskProcessorService {
    private taskRepository;
    constructor(taskRepository: PrismaWorkerTaskRepository);
    /**
     * Lógica de processamento assíncrono.
     * Simula um trabalho pesado e injeta uma taxa de falha controlada.
     */
    processTask(taskId: string, payload: any): Promise<void>;
    private simulateDelay;
}
