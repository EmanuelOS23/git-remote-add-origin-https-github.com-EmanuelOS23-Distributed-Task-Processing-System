import { createLogger } from '@task-system/shared';
import { PrismaWorkerTaskRepository } from '../../infrastructure/database/PrismaWorkerTaskRepository';
import { TaskStatus } from '@prisma/client';

const logger = createLogger('Worker-Processor');

export class TaskProcessorService {
  constructor(private taskRepository: PrismaWorkerTaskRepository) {}

  /**
   * Lógica de processamento assíncrono.
   * Simula um trabalho pesado e injeta uma taxa de falha controlada.
   */
  async processTask(taskId: string, payload: any): Promise<void> {
    logger.info(`Iniciando processamento da tarefa: ${taskId}`);

    // 1. Marca como "Em Processamento" e salva log
    await this.taskRepository.updateStatus(taskId, TaskStatus.PROCESSING);
    await this.taskRepository.createLog(taskId, TaskStatus.PROCESSING, 'O worker iniciou o processamento da tarefa.');

    try {
      // Simulação de processamento pesado (e.g., OCR, Machine Learning, Geração de Relatório)
      await this.simulateDelay(3000); 

      // Simulação de falhas sistêmicas aleatórias (20% de chance)
      const randomFailure = Math.random() < 0.2;
      if (randomFailure) {
        throw new Error('Falha simulada de conexão com serviço externo (API Timeout).');
      }

      // 2. Conclui a tarefa com sucesso
      logger.info(`✅ Tarefa concluída com sucesso: ${taskId}`);
      await this.taskRepository.updateStatus(taskId, TaskStatus.COMPLETED);
      await this.taskRepository.createLog(taskId, TaskStatus.COMPLETED, `Processamento concluído com sucesso. Payload extraído: ${JSON.stringify(payload)}`);
      
    } catch (error: any) {
      // 3. Gerencia falhas sem travar o worker
      logger.error(`❌ Erro ao processar a tarefa ${taskId}: ${error.message}`);
      await this.taskRepository.updateStatus(taskId, TaskStatus.FAILED);
      await this.taskRepository.createLog(taskId, TaskStatus.FAILED, `Processamento abortado devido a erro crítico: ${error.message}`);
    }
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
