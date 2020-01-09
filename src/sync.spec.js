import sync from './sync';
import { getAccountAmount, postAdjustment } from './ynab';
import { getZestimate } from './zillow';

jest.mock('./zillow');
jest.mock('./ynab');

beforeEach(() => {
	getAccountAmount.mockImplementation(({ accessToken, budgetId, accountId }) => Promise.resolve(
		accessToken === 'ACCESS_TOKEN'
		&& budgetId === 'BUDGET_ID'
		&& accountId === 'ACCOUNT_ID'
		&& 1000
	));
	getZestimate.mockImplementation(({ zpId, zwsId }) => Promise.resolve(
		zpId === 'ZPID'
		&& zwsId === 'ZWSID'
		&& { amount: 1000000, date: '2018-01-02' }
	));
	postAdjustment.mockImplementation(() => Promise.resolve(true));
});

afterEach(() => {
	jest.resetAllMocks();
});

it('syncs zillow with ynab', async () => {
	await sync({ accessToken: 'ACCESS_TOKEN', budgetId: 'BUDGET_ID', accountId: 'ACCOUNT_ID', zpId: 'ZPID', zwsId: 'ZWSID' });

	expect(postAdjustment).toHaveBeenCalledWith({
		accessToken:    'ACCESS_TOKEN',
		budgetId:       'BUDGET_ID',
		accountId:      'ACCOUNT_ID',
		zestimate:      1000000,
		previousAmount: 1000,
		date:           '2018-01-02',
		zpId:           'ZPID',
	});
});

it('multiplies by the multiplier', async () => {
	await sync({ accessToken: 'ACCESS_TOKEN', budgetId: 'BUDGET_ID', accountId: 'ACCOUNT_ID', zpId: 'ZPID', zwsId: 'ZWSID', multiplier: 0.5 });

	expect(postAdjustment).toHaveBeenCalledWith({
		accessToken:    'ACCESS_TOKEN',
		budgetId:       'BUDGET_ID',
		accountId:      'ACCOUNT_ID',
		zestimate:      500000,
		previousAmount: 1000,
		date:           '2018-01-02',
		zpId:           'ZPID',
	});
});
