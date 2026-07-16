"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors"); // Catch async errors automaticamente
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const cors_1 = __importDefault(require("cors"));
const shared_1 = require("@task-system/shared");
const env_1 = require("./config/env");
const userRoutes_1 = require("./presentation/routes/userRoutes");
const taskRoutes_1 = require("./presentation/routes/taskRoutes");
const errorHandler_1 = require("./presentation/middlewares/errorHandler");
const logger = (0, shared_1.createLogger)('Gateway-Service');
const app = (0, express_1.default)();
// Middlewares Globais
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rotas
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'API Gateway', time: new Date() });
});
app.use('/api/users', userRoutes_1.userRoutes);
app.use('/api/tasks', taskRoutes_1.taskRoutes);
// Configuração do Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Distributed Task System API',
            version: '1.0.0',
            description: 'API Gateway for the Distributed Task System',
        },
        servers: [
            {
                url: `http://localhost:${env_1.config.PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/presentation/routes/*.ts'], // Caminho para as rotas onde anotaremos o swagger
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Middleware de tratamento de erro (Sempre deve ser o último)
app.use(errorHandler_1.errorHandler);
const PORT = env_1.config.PORT;
app.listen(PORT, () => {
    logger.info(`🚀 API Gateway rodando na porta ${PORT}`);
});
