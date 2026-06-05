import pino from 'pino';
import PinoPretty from 'pino-pretty';

const logger = pino(
  {
    name: 'heal',
    level: process.env.LOG_LEVEL ?? 'debug',
  },
  PinoPretty({
    colorize: true,
    translateTime: 'SYS:HH:MM:ss',
    ignore: 'pid,hostname',
    sync: true,
  })
);

export default logger;
