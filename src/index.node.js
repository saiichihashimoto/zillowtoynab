/* istanbul ignore file */
import { promisify } from 'util';

import express from '@feathersjs/express';
import { FeathersError } from '@feathersjs/errors';

import app from './app';
import log from './log';

const port = app.get('port');

log.info({ port }, 'Server Starting');

const server = app
	.use(express.notFound({ verbose: true }))
	.use(express.errorHandler({
		logger: {
			error: (err) => (
				!(err instanceof FeathersError) || err.code >= 500
					? log.error(err)
					: log.warn(err)
			),
		},
	}))
	.listen(port, () => log.info({ port }, 'Server Started'));

const close = promisify(server.close.bind(server));

process.once('SIGUSR2', async () => {
	log.info({ port }, 'Server Stopping');

	await close();

	log.info({ port }, 'Server Stopped');

	process.kill(process.pid, 'SIGUSR2');
});

process.on('unhandledRejection', (reason) => {
	log.fatal(reason);
	process.exit(1);
});

process.on('uncaughtException', (err) => {
	log.fatal(err);
	process.exit(1);
});
