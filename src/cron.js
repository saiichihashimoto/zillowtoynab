#!/usr/bin/env node
/* istanbul ignore file */
import sync from './sync';

async function cron() {
	try {
		await sync({
			accessToken: process.env.YNAB_ACCESS_TOKEN,
			budgetId:    process.env.BUDGET_ID,
			accountId:   process.env.ACCOUNT_ID,
			zpId:        process.env.ZP_ID,
			zwsId:       process.env.ZWS_ID,
		});
		console.log('success'); // eslint-disable-line no-console
	} catch (err) {
		console.error(err); // eslint-disable-line no-console
	}
}

cron();
