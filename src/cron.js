#!/usr/bin/env node
/* istanbul ignore file */
import './register-shutdown';
import sync from './sync';
import log from './log';

async function cron() {
	const syncOpts = {
		budgetId:  process.env.BUDGET_ID,
		accountId: process.env.ACCOUNT_ID,
		zpId:      process.env.ZP_ID,
	};

	const logCron = log.child({ syncOpts });

	logCron.info('Syncing');

	try {
		const success = await sync({
			...syncOpts,
			accessToken: process.env.YNAB_ACCESS_TOKEN,
			multiplier:  process.env.MULTIPLIER,
			zwsId:       process.env.ZWS_ID,
		});

		logCron.info({ success }, 'Sync Complete');
	} catch (err) {
		logCron.fatal(err);
	}
}

cron();
