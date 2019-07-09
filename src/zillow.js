import parser from 'fast-xml-parser';
import request from 'request-promise-native';

export async function getZestimate(zpid) {
	const body = await request({
		uri: 'https://www.zillow.com/webservice/GetZestimate.htm',
		qs:  {
			zpid,
			'zws-id': process.env.ZWS_ID,
		},
	});

	const {
		'Zestimate:zestimate': {
			message: {
				code,
			},
			response: {
				zestimate: {
					amount,
					'last-updated': lastUpdated,
				} = {},
			} = {},
		},
	} = parser.parse(body);

	if (code !== 0) {
		const err = new Error();
		err.statusCode = code;
		throw err;
	}

	return { amount, date: lastUpdated.replace(/^(\d\d)\/(\d\d)\/(\d\d\d\d)$/, '$3-$1-$2') };
}
