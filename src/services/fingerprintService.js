import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import PQueue from 'p-queue';
import { getLogger } from '../utils/logger.js';
const logger = await getLogger();

class FingerprintService {
  constructor(DB_PATH) {
    this.dbPath = DB_PATH;
    this.db = null;
    this.queue = new PQueue({ concurrency: 1 });
    this.initialize();
  }

  async initialize() {
    if (this.db) return;

    try {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database,
      });

      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS fingerprint (
          value TEXT PRIMARY KEY,
          usedAt INTEGER
        )
      `);

      logger.info('Fingerprint database initialized');
    } catch (error) {
      logger.error(`Error initializing fingerprint database: ${error.message}`);
      throw error;
    }
  }

  async fetchAndUpdateFingerprint() {
    return this.queue.add(async () => {
      try {
        const result = await this.db.get(`
          SELECT value
          FROM fingerprint
          ORDER BY usedAt ASC
          LIMIT 1
        `);

        if (!result) return null;

        await this.db.run(`
          UPDATE fingerprint
          SET usedAt = ?
          WHERE value = ?
        `, [Date.now(), result.value]);

        logger.debug(`Fingerprint fetched and updated: ${result.value}`);
        return result.value;
      } catch (error) {
        logger.error(`Error fetching or updating fingerprint: ${error.message}`);
        throw error;
      }
    });
  }
}

export default FingerprintService;
