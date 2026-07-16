"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
const express_1 = require("express");
const TaskController_1 = require("../controllers/TaskController");
const PrismaTaskRepository_1 = require("../../infrastructure/database/PrismaTaskRepository");
const RabbitMQPublisher_1 = require("../../infrastructure/messaging/RabbitMQPublisher");
const CreateTaskUseCase_1 = require("../../application/use-cases/CreateTaskUseCase");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
exports.taskRoutes = router;
// Injeção de dependências manual
const taskRepository = new PrismaTaskRepository_1.PrismaTaskRepository();
const messagePublisher = new RabbitMQPublisher_1.RabbitMQPublisher();
const createTaskUseCase = new CreateTaskUseCase_1.CreateTaskUseCase(taskRepository, messagePublisher);
const taskController = new TaskController_1.TaskController(createTaskUseCase, taskRepository);
// Todas as rotas de tarefas exigem autenticação
router.use(authMiddleware_1.authMiddleware);
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
