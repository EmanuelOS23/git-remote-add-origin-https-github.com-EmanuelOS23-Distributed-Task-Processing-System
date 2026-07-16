import { User } from '@prisma/client';
export interface UserRepository {
    create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
