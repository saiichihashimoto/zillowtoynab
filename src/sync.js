import { getAccountAmount, postAdjustment } from './ynab';
import { getZestimate } from './zillow';

export default async function sync({ accessToken, budgetId, accountId, zpId, zwsId }) {
	const [
		previousAmount,
		{ amount: zestimate, date },
	] = await Promise.all([
		getAccountAmount({ accessToken, budgetId, accountId }),
		getZestimate({ zpId, zwsId }),
	]);

	return postAdjustment({
		accessToken,
		budgetId,
		accountId,
		zestimate,
		previousAmount,
		date,
		zpId,
	});
}
