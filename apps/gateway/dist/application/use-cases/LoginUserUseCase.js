"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = exports.loginUserSchema = void 0;
const zod_1 = require("zod");
const bcrypt_1 = require("../../utils/bcrypt");
const jwt_1 = require("../../utils/jwt");
const errorHandler_1 = require("../../presentation/middlewares/errorHandler");
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
class LoginUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(data) {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        const passwordMatch = await (0, bcrypt_1.comparePassword)(data.password, user.password);
        if (!passwordMatch) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        const token = (0, jwt_1.generateToken)({ userId: user.id });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
