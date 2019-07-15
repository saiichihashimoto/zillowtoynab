#!/usr/bin/env node
/* istanbul ignore file */
import sync from './sync';

import log from './log';

async function cron() {
	const syncOpts = {
		budgetId:  process.env.BUDGET_ID,
		accountId: process.env.ACCOUNT_ID,
		zpId:      process.env.ZP_ID,
	};

	const logCron = log.child({ syncOpts });

	try {
		logCron.info('syncing');

		const success = await sync({
			...syncOpts,
			accessToken: process.env.YNAB_ACCESS_TOKEN,
			zwsId:       process.env.ZWS_ID,
		});

		logCron.info({ success }, 'sync complete');
	} catch (err) {
		logCron.error(err);
	}
}

cron();
