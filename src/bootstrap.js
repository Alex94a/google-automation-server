import { readConfig } from './config/configLoader.js';
import FingerprintService from './services/fingerprintService.js';
import ProxyService from './services/proxyService.js';
import TaskService from './services/taskService.js';
import createSmsService from './services/smsService.js';
import path from 'path';
import { getLogger } from './utils/logger.js';
const logger = await getLogger();

export async function bootstrap() {
  try {
    const config = await readConfig();

    const accountsFilePath = path.resolve(config.filePaths.accounts);
    const proxyFilePath = path.resolve(config.filePaths.proxies);
    const fingerprintsFilePath = path.resolve(config.filePaths.fingerprints);

    const fingerprintService = new FingerprintService(fingerprintsFilePath);
    const proxyService = new ProxyService(proxyFilePath);
    const taskService = new TaskService(accountsFilePath, config.task, fingerprintService, proxyService);
    const smsService = createSmsService(config.smsService);

    return { taskService, proxyService, fingerprintService, smsService };
  } catch (error) {
    logger.error('Failed to bootstrap application:', error);
    throw error;
  }
}

