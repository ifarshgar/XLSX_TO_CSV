import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getTimestamp = () => {
  return new Date().toISOString().replace(/[:.]/g, '-');
};

const getFilePath = (prefix: string) => {
  const filename = `${prefix}_${getTimestamp()}.log`;
  const directory = path.join(__dirname, '..', 'logs');

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  const filePath = path.join(directory, filename);
  return filePath;
};

/**
 * Creates a logger instance with a dynamic filename.
 * @param prefix - The prefix name of the log file.
 */
export const createLogger = (prefix: string) => {
  return winston.createLogger({
    level: 'verbose',
    format: winston.format.printf((info) => {
      const { message } = info;
      // Ensure objects are properly formatted
      return typeof message === 'object' ? JSON.stringify(message, null, 4) : String(message);
    }),
    transports: [
      new winston.transports.Console({ level: 'info' }),
      new winston.transports.File({ level: 'verbose', filename: getFilePath(prefix) }),
    ],
  });
};

export const logger = createLogger('app-log');
