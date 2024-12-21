import express from 'express';
import { bootstrap } from './bootstrap.js';
import taskRoutes from './routes/taskRoutes.js';
import smsRoutes from './routes/smsRoutes.js';
import { getLogger } from './utils/logger.js';
const logger = await getLogger();


export async function createApp() {
  const app = express();
  app.use(express.json());

  const { taskService, proxyService, fingerprintService, smsService } = await bootstrap();

  app.use('/api/tasks', taskRoutes(taskService));
  app.use('/api/sms', smsRoutes(smsService));

  logger.info('App initialized successfully');
  return app;
}

