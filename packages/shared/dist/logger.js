"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, printf, colorize } = winston_1.default.format;
const customFormat = printf(({ level, message, timestamp, service }) => {
    return `[${timestamp}] [${service || 'Global'}] ${level}: ${message}`;
});
const createLogger = (serviceName) => {
    return winston_1.default.createLogger({
        level: 'info',
        format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), customFormat),
        defaultMeta: { service: serviceName },
        transports: [
            new winston_1.default.transports.Console()
        ],
    });
};
exports.createLogger = createLogger;
