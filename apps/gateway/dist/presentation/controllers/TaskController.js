"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const CreateTaskUseCase_1 = require("../../application/use-cases/CreateTaskUseCase");
const errorHandler_1 = require("../../presentation/middlewares/errorHandler");
class TaskController {
    createTaskUseCase;
    taskRepository;
    constructor(createTaskUseCase, taskRepository) {
        this.createTaskUseCase = createTaskUseCase;
        this.taskRepository = taskRepository;
    }
    async create(req, res) {
        const userId = req.user.id;
        const data = CreateTaskUseCase_1.createTaskSchema.parse(req.body);
        // Processamento rápido. A lentidão ocorrerá no Worker em background.
        const result = await this.createTaskUseCase.execute(userId, data);
        return res.status(202).json({
            message: 'Tarefa enfileirada com sucesso',
            task: result
        });
    }
    async list(req, res) {
        const userId = req.user.id;
        const tasks = await this.taskRepository.findAllByUserId(userId);
        return res.status(200).json(tasks);
    }
    async getById(req, res) {
        const { id } = req.params;
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new errorHandler_1.AppError('Tarefa não encontrada', 404);
        }
        if (task.userId !== req.user.id) {
            throw new errorHandler_1.AppError('Acesso negado', 403);
        }
        return res.status(200).json(task);
    }
}
exports.TaskController = TaskController;
