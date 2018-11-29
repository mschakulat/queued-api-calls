/**
 * @author Michael Schakulat <mschakulat@fetchit.de>
 * @copyright by Michael Schakulat
 */

import { createLogger, format, transports } from 'winston';

export const LOG_FORMAT_JSON = 'json';
export const LOG_FORMAT_DEFAULT = 'default';

export class Logger
{
    constructor(baseDir)
    {
        const {combine, timestamp, printf} = format;
        const myFormat = printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        });
        this.defaultLogger = createLogger({
            format: combine(
                timestamp(),
                myFormat
            ),
            transports: [
                new transports.Console({
                    level: 'debug',
                    format: combine(
                        format.colorize(),
                        timestamp(),
                        myFormat
                    )
                }),
                new transports.File({filename: `${baseDir}/combined.log`, level: 'debug'}),
                new transports.File({filename: `${baseDir}/info.log`, level: 'info'}),
                new transports.File({filename: `${baseDir}/error.log`, level: 'error'}),
            ]
        });

        this.jsonLogger = createLogger({
            format: combine(
                format.colorize(),
                format.json(),
            ),
            transports: [
                new transports.Console({level: 'debug'}),
                new transports.File({filename: `${baseDir}/data.log`, level: 'debug'}),
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