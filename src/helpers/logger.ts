import pino from 'pino';

const logger = pino({
  name: 'heal',
  level: process.env.LOG_LEVEL ?? 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});

export default logger;
