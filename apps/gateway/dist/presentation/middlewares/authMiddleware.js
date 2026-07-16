"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../../utils/jwt");
const errorHandler_1 = require("./errorHandler");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new errorHandler_1.AppError('Token not provided', 401);
    }
    const [, token] = authHeader.split(' ');
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        // Anexa o ID do usuário verificado no Request para os Controllers
        req.user = { id: decoded.userId };
        return next();
    }
    catch (error) {
        throw new errorHandler_1.AppError('Invalid token', 401);
    }
};
exports.authMiddleware = authMiddleware;
