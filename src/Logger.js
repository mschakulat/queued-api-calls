/**
 * @author Michael Schakulat <mschakulat@fetchit.de>
 * @copyright by Michael Schakulat
 */

import * as winston from 'winston';
import { createLogger, format } from 'winston';

export const LOG_FORMAT_JSON = 'json';
export const LOG_FORMAT_DEFAULT = 'default';

export class Logger
{
    constructor(baseDir)
    {
        const { combine, timestamp, printf } = format;
        const myFormat = printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        });
        this.defaultLogger = createLogger({
            format: combine(
                winston.format.colorize(),
                timestamp(),
                myFormat
            ),
            transports: [
                new winston.transports.Console({level: 'debug'}),
                new winston.transports.File({filename: `${baseDir}/combined.log`, level: 'debug'}),
                new winston.transports.File({filename: `${baseDir}/info.log`, level: 'info'}),
                new winston.transports.File({filename: `${baseDir}/error.log`, level: 'error'}),
            ]
        });

        this.jsonLogger = createLogger({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.Console({level: 'debug'}),
                new winston.transports.File({filename: `${baseDir}/data.log`, level: 'debug'}),
            ]
        });
    }

    get(logFormat)
    {
        if (LOG_FORMAT_DEFAULT === logFormat) {
            return this.defaultLogger;
        } else if (LOG_FORMAT_JSON === logFormat) {
            return this.jsonLogger;
        }
        return this.defaultLogger;
    }
}