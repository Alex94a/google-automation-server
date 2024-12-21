import express from 'express';
import taskController from '../controllers/taskController.js';

export default function(taskService) {
  const router = express.Router();

  router.post('/process', (req, res) => taskController.processTask(req, res, taskService));
  router.get('/data', (req, res) => taskController.getTaskData(req, res, taskService));

  return router;
}
