import { Request, Response } from 'express';
import { RegisterUserUseCase, registerUserSchema } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase, loginUserSchema } from '../../application/use-cases/LoginUserUseCase';

export class UserController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase
  ) {}

  async register(req: Request, res: Response) {
    const data = registerUserSchema.parse(req.body);
    const result = await this.registerUserUseCase.execute(data);
    return res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const data = loginUserSchema.parse(req.body);
    const result = await this.loginUserUseCase.execute(data);
    return res.status(200).json(result);
  }
}
