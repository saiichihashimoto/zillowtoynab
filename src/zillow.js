import parser from 'fast-xml-parser';
import request from 'request-promise-native';

const errCodes = {
	1:   500,
	2:   500,
	3:   502,
	4:   502,
	500: 404,
	501: 404,
	502: 404,
};

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
					'last-updated': date,
				} = {},
			} = {},
		},
	} = parser.parse(body);

	if (code !== 0) {
		const err = new Error();
		err.code = errCodes[code];
		throw err;
	}

	return { amount, date };
}
