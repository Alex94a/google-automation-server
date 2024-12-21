import fs from 'fs/promises';
import { Mutex } from 'async-mutex';
import { getLogger } from '../utils/logger.js';
const logger = await getLogger();

class ProxyService {
  constructor(proxyFilePath) {
    this.proxyFilePath = proxyFilePath;
    this.mutex = new Mutex();
  }

  async readAndRotateProxy() {
    const release = await this.mutex.acquire();
    try {
      const proxies = await this._readProxies();

      if (proxies.length === 0) return null;

      const rotatedProxy = proxies.shift();
      proxies.push(rotatedProxy);

      await this._writeProxies(proxies);
      logger.debug(`Proxy rotated: ${rotatedProxy}`);
      return rotatedProxy;
    } catch (error) {
      logger.error(`Error reading or rotating proxies: ${error.message}`);
      throw error;
    } finally {
      release();
    }
  }

  async _readProxies() {
    try {
      await this._ensureProxyFileExists();
      const data = await fs.readFile(this.proxyFilePath, 'utf8');
      const proxies = data
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (proxies.length === 0) logger.warn('No proxies found in the proxy file');

      return proxies;
    } catch (error) {
      logger.error(`Error reading proxy file: ${error.message}`);
      throw error;
    }
  }

  async _writeProxies(proxies) {
    try {
      const data = proxies.join('\n') + '\n';
      await fs.writeFile(this.proxyFilePath, data, 'utf8');
      logger.debug('Proxy file updated successfully');
    } catch (error) {
      logger.error(`Error writing proxy file: ${error.message}`);
      throw error;
    }
  }


  async _ensureProxyFileExists() {
    try {
      await fs.access(this.proxyFilePath);
    } catch {
      await fs.writeFile(this.proxyFilePath, '', 'utf8');
      logger.info(`Proxy file created at: ${this.proxyFilePath}`);
    }
  }
}

export default ProxyService;
