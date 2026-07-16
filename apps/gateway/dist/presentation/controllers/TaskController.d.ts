import { Request, Response } from 'express';
import { CreateTaskUseCase } from '../../application/use-cases/CreateTaskUseCase';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
export declare class TaskController {
    private createTaskUseCase;
    private taskRepository;
    constructor(createTaskUseCase: CreateTaskUseCase, taskRepository: TaskRepository);
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
