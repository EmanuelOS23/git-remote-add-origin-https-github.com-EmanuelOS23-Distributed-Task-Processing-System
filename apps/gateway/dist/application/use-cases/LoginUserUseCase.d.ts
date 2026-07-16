import { z } from 'zod';
import { UserRepository } from '../../domain/repositories/UserRepository';
export declare const loginUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
type LoginUserDTO = z.infer<typeof loginUserSchema>;
export declare class LoginUserUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(data: LoginUserDTO): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        token: string;
    }>;
}
export {};
