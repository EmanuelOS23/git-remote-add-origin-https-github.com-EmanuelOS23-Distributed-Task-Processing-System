import { Request, Response } from 'express';
import { CreateTaskUseCase, createTaskSchema } from '../../application/use-cases/CreateTaskUseCase';
import { TaskRepository } from '../../domain/repositories/TaskRepository';
import { AppError } from '../../presentation/middlewares/errorHandler';

export class TaskController {
  constructor(
    private createTaskUseCase: CreateTaskUseCase,
    private taskRepository: TaskRepository
  ) {}

  async create(req: Request, res: Response) {
    const userId = req.user!.id;
    const data = createTaskSchema.parse(req.body);
    
    // Processamento rápido. A lentidão ocorrerá no Worker em background.
    const result = await this.createTaskUseCase.execute(userId, data);
    return res.status(202).json({
      message: 'Tarefa enfileirada com sucesso',
      task: result
    });
  }

  async list(req: Request, res: Response) {
    const userId = req.user!.id;
    const tasks = await this.taskRepository.findAllByUserId(userId);
    return res.status(200).json(tasks);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    if (task.userId !== req.user!.id) {
      throw new AppError('Acesso negado', 403);
    }

    return res.status(200).json(task);
  }
}
