"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const shared_1 = require("@task-system/shared");
const logger = (0, shared_1.createLogger)('API-Gateway');
class AppError extends Error {
    statusCode;
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        logger.warn(`AppError: ${err.message}`);
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    if (err instanceof zod_1.ZodError) {
        logger.warn('ValidationError: Invalid DTO');
        return res.status(400).json({
            status: 'error',
            message: 'Validation Error',
            errors: err.errors,
        });
    }
    logger.error(`Internal Server Error: ${err.message}\n${err.stack}`);
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;
