"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
const bcrypt_1 = require("../../utils/bcrypt");
const errorHandler_1 = require("../../presentation/middlewares/errorHandler");
exports.registerUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
class RegisterUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new errorHandler_1.AppError('Email already in use', 409);
        }
        const hashedPassword = await (0, bcrypt_1.hashPassword)(data.password);
        const user = await this.userRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
