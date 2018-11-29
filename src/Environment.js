/**
 * @author Michael Schakulat <mschakulat@fetchit.de>
 * @copyright by Michael Schakulat
 */

const ENV_DEV = 'development';
const ENV_PRODUCTION = 'production';
const PARAMS_FILE = 'data-%env%.json';
const URL_DEV = 'http://queue.local/%id%/%name%';
const URL_PRODUCTION = 'http://queue.production/%id%/%name%';

export class Environment
{
    /**
     * @param environment
     */
    constructor(environment)
    {
        this.environment = environment || ENV_DEV;
    }

    /**
     * @returns {string}
     */
    getEnvironment()
    {
        if (ENV_PRODUCTION === this.environment) {
            return ENV_PRODUCTION;
        }
        return ENV_DEV;
    }

    /**
     * @returns {string}
     */
    getBaseUrl()
    {
        if (ENV_PRODUCTION === this.getEnvironment()) {
            return URL_PRODUCTION;
        }
        return URL_DEV;
    }

    /**
     * @returns {string}
     */
    getDataFile()
    {
        return PARAMS_FILE.replace('%env%', this.getEnvironment());
    }
}