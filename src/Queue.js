/**
 * @author Michael Schakulat <mschakulat@fetchit.de>
 * @copyright by Michael Schakulat
 */

import axios from 'axios';
import { queue, asyncify } from 'async';
import { LOG_FORMAT_DEFAULT, LOG_FORMAT_JSON } from './Logger';

const RESPONSE_OK = 'info';
const RESPONSE_ERROR = 'error';
const RESPONSE_SUCCESS = 'success';
const BEARER = '[my-auth-token]';

export class Queue
{
    /**
     * @param {number} concurrent
     * @param {Logger} logger
     * @param {Environment} environment
     */
    constructor(concurrent, logger, environment)
    {
        const axiosConfig = {
            headers: {
                'QueueAuth': BEARER,
            }
        };

        this.environment = environment;
        this.logger = logger.get(LOG_FORMAT_DEFAULT);
        this.jsonLogger = logger.get(LOG_FORMAT_JSON);

        this.queue = queue(asyncify(async (task) => {
            const response = await axios.get(task, axiosConfig);
            if (RESPONSE_OK === response.data.status
                || RESPONSE_SUCCESS === response.data.status
            ) {
                this.logger.info(
                    `${response.data.status} ${response.data.message}`
                );
            } else if (response.data.status === RESPONSE_ERROR) {
                this.logger.error(response.data.message);
            } else {
                this.logger.error(`Unknown Error: ${JSON.stringify(response.data)}`);
            }
            // Data should provide valid JSON
            if (response.data.data) {
                this.jsonLogger.info(response.data.data);
            }
        }), concurrent);

        this.queue.drain = () => {
            this.logger.info('Items processed');
        };
    }

    /**
     * @param {object} params
     */
    addParams(params)
    {
        let baseUrl = this.environment.getBaseUrl();
        if (params) {
            for (const param in params) {
                if (params.hasOwnProperty(param)) {
                    baseUrl = baseUrl.replace(`%${param}%`, params[ param ]);
                }
            }
        }
        this.logger.verbose(`Adding item to queue: ${JSON.stringify(params)} [${baseUrl}]`);
        this.queue.push(baseUrl, (err) => {
            if (err) {
                this.logger.error(err.message);
                return;
            }
            this.logger.info(`Queue handling completed for ${JSON.stringify(params)}`);
        });
    }
}