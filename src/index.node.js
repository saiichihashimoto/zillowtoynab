/* istanbul ignore file */
import { promisify } from 'util';

import express from '@feathersjs/express';
import throng from 'throng';
import { FeathersError } from '@feathersjs/errors';

import onShutdown from './register-shutdown';
import app from './app';
import log from './log';

function start() {
	app
		.use(express.notFound({ verbose: true }))
		.use(express.errorHandler({
			logger: {
				error: (err) => (
					!(err instanceof FeathersError) || err.code >= 500
						? log.error(err)
						: log.warn(err)
				),
				info: (...args) => log.info(...args),
			},
		}));

	const port = app.get('port');

	const logServer = log.child({ port });

	const server = app
		.listen(port)
		.on('listening', () => logServer.info('Server Listening'))
		.on('close', () => logServer.info('Server Closed'))
		.on('error', (err) => logServer.fatal(err, 'Server Error'));

	onShutdown(promisify(server.close.bind(server)));
}

if (process.env.NODE_ENV === 'production' && process.env.WEB_CONCURRENCY > 1) {
	throng({
		start,
		workers:  process.env.WEB_CONCURRENCY,
		lifetime: Infinity,
	});
} else {
	// clusters ALWAYS run `node` instead of `babel-node`, so can't use throng in development
	start();
}
