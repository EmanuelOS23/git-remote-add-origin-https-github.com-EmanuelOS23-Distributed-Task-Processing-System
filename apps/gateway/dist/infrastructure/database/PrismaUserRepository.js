"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PrismaUserRepository {
    async create(data) {
        return prisma.user.create({
            data,
        });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
