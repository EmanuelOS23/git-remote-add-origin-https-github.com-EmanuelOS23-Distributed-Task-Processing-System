import { z } from 'zod';
import { UserRepository } from '../../domain/repositories/UserRepository';
export declare const registerUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export declare class RegisterUserUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(data: RegisterUserDTO): Promise<{
        id: string;
        name: string;
        email: string;
    }>;
}
export {};
