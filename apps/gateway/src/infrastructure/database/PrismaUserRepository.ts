import { PrismaClient, User } from '@prisma/client';
import { UserRepository } from '../../domain/repositories/UserRepository';

const prisma = new PrismaClient();

export class PrismaUserRepository implements UserRepository {
  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}
