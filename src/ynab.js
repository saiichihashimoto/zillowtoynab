/* eslint-disable camelcase */
import request from 'request-promise-native';

export async function getAccountAmount({ accessToken, budgetId, accountId }) {
	const {
		data: {
			account: {
				cleared_balance: clearedBalance,
			},
		},
	} = await request({
		uri:     `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts/${accountId}`,
		json:    true,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return clearedBalance / 1000;
}

export async function getAssetAccounts({ accessToken, budgetId }) {
	const {
		data: {
			accounts,
		},
	} = await request({
		uri:     `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts`,
		json:    true,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return accounts
		.filter(({ type }) => type === 'otherAsset')
		.map(({ id, name, cleared_balance: clearedBalance }) => ({
			id,
			name,
			amount: clearedBalance / 1000,
		}));
}

export async function getBudgets({ accessToken }) {
	const {
		data: {
			budgets,
		},
	} = await request({
		uri:     'https://api.youneedabudget.com/v1/budgets',
		json:    true,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return budgets.map(({ id, name }) => ({ id, name }));
}

export async function postAdjustment({
	accessToken,
	budgetId,
	accountId,
	zestimate,
	previousAmount,
	date,
	zpId,
}) {
	const amount = Math.floor((zestimate - previousAmount) * 1000);

	if (!amount) {
		return false;
	}

	await request({
		uri:     `https://api.youneedabudget.com/v1/budgets/${budgetId}/transactions`,
		method:  'POST',
		json:    true,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		body: {
			transaction: {
				date,
				account_id: accountId,
				amount,
				payee_name: 'Zestimate® Balance Adjustment',
				memo:       'Entered automatically by ZtYNAB',
				cleared:    'cleared',
				approved:   true,
				import_id:  `zillowtoynab:${zpId}:${date}`,
			},
		},
	});

	return true;
}
