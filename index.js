import { createApp } from './src/app.js';
import { readConfig } from './src/config/configLoader.js';
import { getLogger } from './src/utils/logger.js';
const logger = await getLogger();


async function startServer() {
  try {
    const config = await readConfig();

    const app = await createApp();
    const port = config.server.port;

    app.listen(port, () => {
      logger.info(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
