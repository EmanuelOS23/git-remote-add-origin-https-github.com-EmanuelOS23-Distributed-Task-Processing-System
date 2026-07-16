import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { PrismaTaskRepository } from '../../infrastructure/database/PrismaTaskRepository';
import { RabbitMQPublisher } from '../../infrastructure/messaging/RabbitMQPublisher';
import { CreateTaskUseCase } from '../../application/use-cases/CreateTaskUseCase';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Injeção de dependências manual
const taskRepository = new PrismaTaskRepository();
const messagePublisher = new RabbitMQPublisher();
const createTaskUseCase = new CreateTaskUseCase(taskRepository, messagePublisher);
const taskController = new TaskController(createTaskUseCase, taskRepository);

// Todas as rotas de tarefas exigem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               payload:
 *                 type: object
 *     responses:
 *       201:
 *         description: Task created
 *
 *   get:
 *     summary: List all tasks for the logged in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.post('/', (req, res) => taskController.create(req, res));
router.get('/', (req, res) => taskController.list(req, res));

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task details by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 */
router.get('/:id', (req, res) => taskController.getById(req, res));

export { router as taskRoutes };
