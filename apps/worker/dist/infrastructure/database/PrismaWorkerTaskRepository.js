"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaWorkerTaskRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PrismaWorkerTaskRepository {
    /**
     * Atualiza o status da tarefa principal.
     */
    async updateStatus(taskId, status) {
        await prisma.task.update({
            where: { id: taskId },
            data: { status },
        });
    }
    /**
     * Cria uma entrada na tabela de Logs (histórico/rastreabilidade da tarefa).
     */
    async createLog(taskId, status, message) {
        await prisma.taskLog.create({
            data: {
                taskId,
                status,
                message,
            },
        });
    }
}
exports.PrismaWorkerTaskRepository = PrismaWorkerTaskRepository;
