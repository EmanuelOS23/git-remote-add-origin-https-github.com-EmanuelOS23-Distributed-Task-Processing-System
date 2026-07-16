"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskProcessorService = void 0;
const shared_1 = require("@task-system/shared");
const client_1 = require("@prisma/client");
const logger = (0, shared_1.createLogger)('Worker-Processor');
class TaskProcessorService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    /**
     * Lógica de processamento assíncrono.
     * Simula um trabalho pesado e injeta uma taxa de falha controlada.
     */
    async processTask(taskId, payload) {
        logger.info(`Iniciando processamento da tarefa: ${taskId}`);
        // 1. Marca como "Em Processamento" e salva log
        await this.taskRepository.updateStatus(taskId, client_1.TaskStatus.PROCESSING);
        await this.taskRepository.createLog(taskId, client_1.TaskStatus.PROCESSING, 'O worker iniciou o processamento da tarefa.');
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
            await this.taskRepository.updateStatus(taskId, client_1.TaskStatus.COMPLETED);
            await this.taskRepository.createLog(taskId, client_1.TaskStatus.COMPLETED, `Processamento concluído com sucesso. Payload extraído: ${JSON.stringify(payload)}`);
        }
        catch (error) {
            // 3. Gerencia falhas sem travar o worker
            logger.error(`❌ Erro ao processar a tarefa ${taskId}: ${error.message}`);
            await this.taskRepository.updateStatus(taskId, client_1.TaskStatus.FAILED);
            await this.taskRepository.createLog(taskId, client_1.TaskStatus.FAILED, `Processamento abortado devido a erro crítico: ${error.message}`);
        }
    }
    simulateDelay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.TaskProcessorService = TaskProcessorService;
