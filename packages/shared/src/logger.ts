import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, service }) => {
  return `[${timestamp}] [${service || 'Global'}] ${level}: ${message}`;
});

export const createLogger = (serviceName: string) => {
  return winston.createLogger({
    level: 'info',
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      customFormat
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.Console()
    ],
  });
};
