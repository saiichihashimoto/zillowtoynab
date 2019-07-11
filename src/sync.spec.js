import sync from './sync';
import { getAccountAmount, postAdjustment } from './ynab';
import { getZestimate } from './zillow';

jest.mock('./zillow');
jest.mock('./ynab');

describe('sync', () => {
	beforeEach(() => {
		getAccountAmount.mockImplementation(async ({ accessToken, budgetId, accountId }) => (
			accessToken === 'ACCESS_TOKEN' &&
			budgetId === 'BUDGET_ID' &&
			accountId === 'ACCOUNT_ID' &&
			1000
		));
		getZestimate.mockImplementation(async ({ zpId, zwsId }) => (
			zpId === 'ZPID' &&
			zwsId === 'ZWSID' &&
			{ amount: 1000000, date: '2018-01-02' }
		));
		postAdjustment.mockImplementation(async () => true);
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
});
