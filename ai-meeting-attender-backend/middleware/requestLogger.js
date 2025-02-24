const winston = require('winston');
require('winston-daily-rotate-file');
const morgan = require('morgan');

// Configure Winston logger with daily rotation
const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/request-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        transport
    ]
});

// Create a stream object with a 'write' function that will be used by Morgan
logger.stream = {
    write: function(message) {
        logger.info(message.trim());
    },
};

// Morgan middleware setup
const requestLogger = morgan('combined', { stream: logger.stream });

module.exports = requestLogger; 