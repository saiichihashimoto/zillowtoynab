/* eslint-disable camelcase */
import request from 'request-promise-native';
import { StatusCodeError } from 'request-promise-native/errors';

import { getAccountAmount, getAssetAccounts, getBudgets, postAdjustment } from './ynab';

jest.mock('request-promise-native');

afterEach(() => {
	jest.resetAllMocks();
});

describe('getAccountAmount', () => {
	beforeEach(() => {
		request.mockImplementation(() => Promise.resolve({
			data: {
				account: {
					id:                'ACCOUNT_ID',
					name:              'Account Name',
					type:              'otherAsset',
					on_budget:         false,
					closed:            false,
					note:              null,
					balance:           1000000,
					cleared_balance:   1000000,
					uncleared_balance: 0,
					transfer_payee_id: 'TRANSFER_PAYEE_ID',
					deleted:           false,
				},
			},
		}));
	});

	it('gets the amount', async () => expect(await getAccountAmount({ accessToken: 'ACCESS_TOKEN', budgetId: 'BUDGET_ID', accountId: 'ACCOUNT_ID' })).toBe(1000));

	it('uses the correct options', async () => {
		await getAccountAmount({ accessToken: 'ACCESS_TOKEN', budgetId: 'BUDGET_ID', accountId: 'ACCOUNT_ID' });

		expect(request).toHaveBeenCalledWith({
			uri:     'https://api.youneedabudget.com/v1/budgets/BUDGET_ID/accounts/ACCOUNT_ID',
			json:    true,
			headers: {
				Authorization: 'Bearer ACCESS_TOKEN',
			},
		});
	});

	it('rejects with statusCode', async () => {
		request.mockImplementation(() => Promise.reject(new StatusCodeError(400)));

		await expect(getAccountAmount({
			accessToken: 'ACCESS_TOKEN',
			budgetId:    'BUDGET_ID',
			accountId:   'ACCOUNT_ID',
		})).rejects.toHaveProperty('statusCode', 400);
	});
});

describe('getAssetAccounts', () => {
	beforeEach(() => {
		request.mockImplementation(() => Promise.resolve({
			data: {
				accounts: [
					{
						id:                'ACCOUNT_ID',
						name:              'Account Name',
						type:              'otherAsset',
						on_budget:         false,
						closed:            false,
						note:              null,
						balance:           1000000,
						cleared_balance:   1000000,
						uncleared_balance: 0,
						transfer_payee_id: 'TRANSFER_PAYEE_ID',
						deleted:           false,
					},
					{
						id:                'ACCOUNT_ID_2',
						name:              'Account Name 2',
						type:              'checking',
						on_budget:         false,
						closed:            false,
						note:              null,
						balance:           1000000,
						cleared_balance:   1000000,
						uncleared_balance: 0,
						transfer_payee_id: 'TRANSFER_PAYEE_ID',
						deleted:           false,
					},
				],
				server_knowledge: 98,
			},
		}));
	});

	it('gets the asset accounts', async () => expect(await getAssetAccounts({ accessToken: 'ACCESS_TOKEN', budgetId: 'BUDGET_ID' }))
		.toStrictEqual(expect.arrayContaining([
			{
				id:     'ACCOUNT_ID',
				name:   'Account Name',
				amount: 1000,
			},
		])));

	it('ignores other accounts', async () => expect(await getAssetAccounts({ accessToken: 'ACCESS_TOKEN', budgetId: 'BUDGET_ID' }))
		.toStrictEqual(expect.not.arrayContaining([
			expect.objectContaining({
				id: 'ACCOUNT_ID_2',
			}),
		])));

	it('uses the correct options', async () => {
		await getAssetAccounts({ accessToken: 'ACCESS_TOKEN', budgetId: 'BUDGET_ID' });

		expect(request).toHaveBeenCalledWith({
			uri:     'https://api.youneedabudget.com/v1/budgets/BUDGET_ID/accounts',
			json:    true,
			headers: {
				Authorization: 'Bearer ACCESS_TOKEN',
			},
		});
	});

	it('rejects with statusCode', async () => {
		request.mockImplementation(() => Promise.reject(new StatusCodeError(400)));

		await expect(getAssetAccounts({ accessToken: 'ACCESS_TOKEN', budgetId: 'BUDGET_ID' })).rejects.toHaveProperty('statusCode', 400);
	});
});

describe('getBudgets', () => {
	beforeEach(() => {
		request.mockImplementation(() => Promise.resolve({
			data: {
				budgets: [
					{
						id:               'BUDGET_ID',
						name:             'Budget Name',
						last_modified_on: '2019-07-09T04:05:34+00:00',
						first_month:      '2018-01-01',
						last_month:       '2019-08-01',
						date_format:      {
							format: 'MM/DD/YYYY',
						},
						currency_format: {
							iso_code:          'USD',
							example_format:    '123,456.78',
							decimal_digits:    2,
							decimal_separator: '.',
							symbol_first:      true,
							group_separator:   ',',
							currency_symbol:   '$',
							display_symbol:    true,
						},
					},
				],
			},
		}));
	});

	it('gets the budgets', async () => expect(await getBudgets({ accessToken: 'ACCESS_TOKEN' })).toStrictEqual([{ id: 'BUDGET_ID', name: 'Budget Name' }]));

	it('uses the correct options', async () => {
		await getBudgets({ accessToken: 'ACCESS_TOKEN' });

		expect(request).toHaveBeenCalledWith({
			uri:     'https://api.youneedabudget.com/v1/budgets',
			json:    true,
			headers: {
				Authorization: 'Bearer ACCESS_TOKEN',
			},
		});
	});

	it('rejects with statusCode', async () => {
		request.mockImplementation(() => Promise.reject(new StatusCodeError(400)));

		await expect(getBudgets({ accessToken: 'ACCESS_TOKEN' })).rejects.toHaveProperty('statusCode', 400);
	});
});

describe('postAdjustment', () => {
	beforeEach(() => {
		request.mockImplementation(() => Promise.resolve({
			data: {
				transaction_ids: ['TRANSACTION_ID'],
				transaction:     {
					id:                      'TRANSACTION_ID',
					date:                    '2018-01-02',
					amount:                  (1000000 - 1000) * 1000,
					memo:                    'Entered automatically by ZtYNAB',
					cleared:                 'cleared',
					approved:                true,
					flag_color:              null,
					account_id:              'ACCOUNT_ID',
					account_name:            'Account Name',
					payee_id:                'PAYEE_ID',
					payee_name:              'Zestimate® Balance Adjustment',
					category_id:             null,
					category_name:           null,
					transfer_account_id:     null,
					transfer_transaction_id: null,
					matched_transaction_id:  null,
					import_id:               'zillowtoynab:ZPID:2018-01-02',
					deleted:                 false,
					subtransactions:         [],
				},
				server_knowledge: 7,
			},
		}));
	});

	it('posts a transaction', async () => expect(await postAdjustment({
		accessToken:    'ACCESS_TOKEN',
		budgetId:       'BUDGET_ID',
		accountId:      'ACCOUNT_ID',
		zestimate:      1000000,
		previousAmount: 1000,
		date:           '2018-01-02',
		zpId:           'ZPID',
	})).toBe(true));

	it('uses the correct options', async () => {
		await postAdjustment({
			accessToken:    'ACCESS_TOKEN',
			budgetId:       'BUDGET_ID',
			accountId:      'ACCOUNT_ID',
			zestimate:      1000000,
			previousAmount: 1000,
			date:           '2018-01-02',
			zpId:           'ZPID',
		});

		expect(request).toHaveBeenCalledWith({
			uri:     'https://api.youneedabudget.com/v1/budgets/BUDGET_ID/transactions',
			method:  'POST',
			json:    true,
			headers: {
				Authorization: 'Bearer ACCESS_TOKEN',
			},
			body: {
				transaction: {
					date:       '2018-01-02',
					account_id: 'ACCOUNT_ID',
					amount:     (1000000 - 1000) * 1000,
					payee_name: 'Zestimate® Balance Adjustment',
					memo:       'Entered automatically by ZtYNAB',
					cleared:    'cleared',
					approved:   true,
					import_id:  'zillowtoynab:ZPID:2018-01-02',
				},
			},
		});
	});

	it('does nothing with net zero adjustment', async () => {
		expect(await postAdjustment({
			accessToken:    'ACCESS_TOKEN',
			budgetId:       'BUDGET_ID',
			accountId:      'ACCOUNT_ID',
			zestimate:      1000000,
			previousAmount: 1000000,
			date:           '2018-01-02',
			zpId:           'ZPID',
		})).toBe(false);

		expect(request).not.toHaveBeenCalled();
	});

	it('rejects with statusCode', async () => {
		request.mockImplementation(() => Promise.reject(new StatusCodeError(400)));

		await expect(postAdjustment({
			accessToken:    'ACCESS_TOKEN',
			budgetId:       'BUDGET_ID',
			accountId:      'ACCOUNT_ID',
			zestimate:      1000000,
			previousAmount: 1000,
			date:           '2018-01-02',
			zpId:           'ZPID',
		})).rejects.toHaveProperty('statusCode', 400);
	});
});
