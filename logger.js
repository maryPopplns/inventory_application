const winston = require('winston');

let alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.label({
    label: '[LOGGER]',
  }),
  winston.format.timestamp({
    format: 'YY-MM-DD HH:MM:SS',
  }),
  winston.format.printf(
    (info) =>
      // ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
      `[ ${info.timestamp} ][ ${info.level} ] : ${info.message}`
  )
);

winston.addColors({
  info: 'bold blue', // fontStyle color
  warn: 'italic yellow',
  error: 'bold red',
  debug: 'green',
});

exports.db = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        alignColorsAndTime
      ),
    }),
    new winston.transports.File({
      filename: 'populateDB/logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'populateDB/logs/info.log',
      level: 'info',
    }),
    new winston.transports.File({ filename: 'populateDB/logs/all.log' }),
  ],
});

exports.logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        alignColorsAndTime
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/info.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'logs/debug.log',
      level: 'debug',
    }),
  ],
});
