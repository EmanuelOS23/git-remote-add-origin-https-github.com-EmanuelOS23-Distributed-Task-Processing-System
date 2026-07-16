"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const PrismaUserRepository_1 = require("../../infrastructure/database/PrismaUserRepository");
const RegisterUserUseCase_1 = require("../../application/use-cases/RegisterUserUseCase");
const LoginUserUseCase_1 = require("../../application/use-cases/LoginUserUseCase");
const router = (0, express_1.Router)();
exports.userRoutes = router;
// Injeção de dependências manual (Inversion of Control simplificado)
const userRepository = new PrismaUserRepository_1.PrismaUserRepository();
const registerUserUseCase = new RegisterUserUseCase_1.RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase_1.LoginUserUseCase(userRepository);
const userController = new UserController_1.UserController(registerUserUseCase, loginUserUseCase);
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 * /api/users/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
