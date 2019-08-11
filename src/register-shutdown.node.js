/* istanbul ignore file */
import log from './log';

const handlers = [];

function shutdown() {
	return Promise.all(handlers.map(async (handler) => {
		try {
			await handler();
		} catch (err) {
			log.error(err);
		}
	}));
}

function unhandledError(msg) {
	return async (err) => {
		log.fatal(err, msg);

		await shutdown();

		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	};
}

async function handleSignal(signal) {
	log.warn({ signal }, 'Received Signal');

	await shutdown();

	process.kill(process.pid, 'SIGUSR2');
}

process
	.once('SIGINT', handleSignal)
	.once('SIGTERM', handleSignal)
	.once('SIGUSR2', handleSignal) // nodemon
	.once('uncaughtException', unhandledError('uncaughtException'))
	.once('unhandledRejection', unhandledError('unhandledRejection'));

export default function onShutdown(handler) {
	handlers.push(handler);
}
