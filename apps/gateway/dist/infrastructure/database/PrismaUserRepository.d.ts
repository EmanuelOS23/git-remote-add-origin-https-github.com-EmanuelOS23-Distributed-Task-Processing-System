import { User } from '@prisma/client';
import { UserRepository } from '../../domain/repositories/UserRepository';
export declare class PrismaUserRepository implements UserRepository {
    create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
