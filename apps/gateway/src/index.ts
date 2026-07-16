import 'express-async-errors'; // Catch async errors automaticamente
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';
import { createLogger } from '@task-system/shared';
import { config } from './config/env';
import { userRoutes } from './presentation/routes/userRoutes';
import { taskRoutes } from './presentation/routes/taskRoutes';
import { errorHandler } from './presentation/middlewares/errorHandler';

const logger = createLogger('Gateway-Service');
const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Rotas
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'API Gateway', time: new Date() });
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

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
        url: `http://localhost:${config.PORT}`,
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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware de tratamento de erro (Sempre deve ser o último)
app.use(errorHandler);

const PORT = config.PORT;

app.listen(PORT, () => {
  logger.info(`🚀 API Gateway rodando na porta ${PORT}`);
});
