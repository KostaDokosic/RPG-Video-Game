import morgan from 'morgan';
import winston from 'winston';

const { combine, timestamp, json } = winston.format;

const httpLogger = winston.createLogger({
  level: 'http',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json()
  ),
  transports: [new winston.transports.Console()],
});

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => httpLogger.http(message.trim()),
    },
  }
);
