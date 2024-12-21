import fs from 'fs/promises';
import { getLogger } from '../utils/logger.js';
const logger = await getLogger();

class TaskService {
  constructor(accountsFilePath, taskConfig, fingerprintService, proxyService) {
    if (TaskService.instance) {
      return TaskService.instance;
    }

    this.accountsFilePath = accountsFilePath;
    this.taskConfig = taskConfig;
    this.fingerprintService = fingerprintService;
    this.proxyService = proxyService;
    TaskService.instance = this;
  }

  async processTaskResult(result) {
    try {
      const { status, accountData, error } = result;

      if (status === 'success') {
        const { login, password, recoveryEmail, googleStatus, youtubeStatus } = accountData;

        const statusMessage = [
          googleStatus ? 'google' : null, 
          youtubeStatus ? 'youtube' : null
        ]
          .filter(Boolean)
          .join(',') || 'failed';

        const line = `${login}:${password}:${recoveryEmail}:${statusMessage}\n`;

        await fs.appendFile(this.accountsFilePath, line, 'utf8');
        logger.info(`Account successfully processed: ${login} (${statusMessage})`);
      } else {
        logger.error(`Task failed: ${error}`);
      }

      console.log({
        status,
        reason: error || null,
        accountData: status === 'success' ? accountData : null,
      });
    } catch (err) {
      logger.error(`Error processing task result: ${err.message}`);
      throw err;
    }
  }

  async getTaskResponse() {
    try {
      await this._ensureAccountsFileExists();
      const fingerprint = await this.fingerprintService.fetchAndUpdateFingerprint();
      const proxy = await this.proxyService.readAndRotateProxy();

      const response = { task: this.taskConfig, fingerprint, proxy };
      logger.info(`Task response generated: ${JSON.stringify({ task: this.taskConfig, fingerprint: `(Fingerprint too long to display)`, proxy })}`);
      return response;
    } catch (error) {
      logger.error(`Error generating task response: ${error.message}`);
      throw error;
    }
  }

  async _ensureAccountsFileExists() {
    try {
      await fs.access(this.accountsFilePath);
    } catch {
      await fs.writeFile(this.accountsFilePath, '', 'utf8');
      logger.info(`Accounts file created at: ${this.accountsFilePath}`);
    }
  }
}

export default TaskService;
