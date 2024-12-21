import winston from 'winston';
import path from 'path';
import { readConfig } from '../config/configLoader.js';
import fs from 'fs/promises';

let logger = null;

export const getLogger = async () => {
  if (logger) {
    return logger;
  }

  const config = await readConfig();
  const logDirectory = './logs/';

  await fs.mkdir(logDirectory, { recursive: true });

  logger = winston.createLogger({
    level: config.server.logLevel || 'info',
    format: winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, stack }) => {
        return stack
          ? `${timestamp} [${level.toUpperCase()}]: ${message} \n${stack}`
          : `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    ),
    transports: [
      new winston.transports.File({
        filename: path.join(logDirectory, 'server.log'),
      }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  });

  return logger;
};
