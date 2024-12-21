import { getLogger } from '../utils/logger.js';
const logger = await getLogger();

export const processTask = async (req, res, taskService) => {
  try {
    logger.info(`Received request to process task with data: ${JSON.stringify(req.body)}`);
    const result = req.body;
    await taskService.processTaskResult(result);
    
    logger.info('Task processed successfully');
    res.status(200).json({ message: 'Task processed successfully' });
  } catch (error) {
    logger.error(`Error processing task: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Error processing task', error: error.message });
  }
};

export const getTaskData = async (req, res, taskService) => {
  try {
    logger.info('Received request to get task data');
    const response = await taskService.getTaskResponse();
    
    logger.info('Task data retrieved successfully');
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error generating task data: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Error generating task data', error: error.message });
  }
};


export default {processTask,  getTaskData};