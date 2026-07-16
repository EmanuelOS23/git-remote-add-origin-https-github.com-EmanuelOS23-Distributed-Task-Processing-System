"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaTaskRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PrismaTaskRepository {
    async create(data) {
        return prisma.task.create({
            data: {
                ...data,
                status: 'PENDING',
            },
        });
    }
    async findById(id) {
        return prisma.task.findUnique({
            where: { id },
            include: { logs: true }, // Inclui os logs de execução para visualização
        });
    }
    async findAllByUserId(userId) {
        return prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.PrismaTaskRepository = PrismaTaskRepository;
