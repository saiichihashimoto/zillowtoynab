import { getAccountAmount, postAdjustment } from './ynab';
import { getZestimate } from './zillow';

export default async function sync({
	accessToken,
	accountId,
	budgetId,
	zpId,
	zwsId,
	multiplier = 1,
}) {
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
		previousAmount,
		date,
		zpId,
		zestimate: zestimate * multiplier,
	});
}
