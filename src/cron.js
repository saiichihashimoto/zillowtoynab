#!/usr/bin/env node
/* istanbul ignore file */
import './register-shutdown';
import { MongoClient } from 'mongodb';

import sync from './sync';
import log from './log';

async function cron() {
	let client;

	try {
		log.info('Connecting to Mongodb');

		client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
		const db = client.db('zillowtoynab');

		await Promise.all((await db.collection('connections')
			.find({})
			.toArray())
			.map(async ({
				accessToken,
				accountId,
				budgetId,
				dayOfWeek,
				multiplier,
				zpId,
			}) => {
				const syncOpts = {
					accountId,
					budgetId,
					dayOfWeek,
					zpId,
				};

				const logCron = log.child({ syncOpts });

				if (new Date().getDay() !== dayOfWeek) {
					logCron.info('Skipping Sync');

					return;
				}

				logCron.info('Syncing');

				try {
					logCron.info(
						{
							neededSync: await sync({
								...syncOpts,
								zwsId: process.env.ZWS_ID,
								accessToken,
								multiplier,
							}),
						},
						'Sync Complete'
					);
				} catch (err) {
					logCron.error(err);
				}

				await Promise.resolve();
			}));
	} catch (err) {
		log.fatal(err);
	}

	await client.close();
}

cron();
