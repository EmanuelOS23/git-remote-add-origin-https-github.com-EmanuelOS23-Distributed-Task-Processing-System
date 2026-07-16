"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const RegisterUserUseCase_1 = require("../../application/use-cases/RegisterUserUseCase");
const LoginUserUseCase_1 = require("../../application/use-cases/LoginUserUseCase");
class UserController {
    registerUserUseCase;
    loginUserUseCase;
    constructor(registerUserUseCase, loginUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }
    async register(req, res) {
        const data = RegisterUserUseCase_1.registerUserSchema.parse(req.body);
        const result = await this.registerUserUseCase.execute(data);
        return res.status(201).json(result);
    }
    async login(req, res) {
        const data = LoginUserUseCase_1.loginUserSchema.parse(req.body);
        const result = await this.loginUserUseCase.execute(data);
        return res.status(200).json(result);
    }
}
exports.UserController = UserController;
