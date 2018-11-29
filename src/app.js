/**
 * @author Michael Schakulat <mschakulat@fetchit.de>
 * @copyright by Michael Schakulat
 */

require('./Errorhandling');

import { join } from 'path';
import { Logger } from './Logger';
import { Queue } from './Queue';
import { Environment } from './Environment';

const concurrent = 10;

const baseDir = `${__dirname}/..`;
const environment = new Environment(process.env.NODE_ENV);

const params = require(join(baseDir, 'data', environment.getDataFile())).params;
const logger = new Logger(join(baseDir, 'logs'));
const queue = new Queue(concurrent, logger, environment);

params.forEach((customer) => {
    queue.addParams(customer.id, customer.name);
});