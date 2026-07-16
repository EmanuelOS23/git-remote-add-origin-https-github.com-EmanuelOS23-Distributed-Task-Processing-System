import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
export declare class UserController {
    private registerUserUseCase;
    private loginUserUseCase;
    constructor(registerUserUseCase: RegisterUserUseCase, loginUserUseCase: LoginUserUseCase);
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
