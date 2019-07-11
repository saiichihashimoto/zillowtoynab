import parser from 'fast-xml-parser';
import request from 'request-promise-native';
import { StatusCodeError } from 'request-promise-native/errors';

export async function getZestimate({ zpId, zwsId }) {
	const body = await request({
		uri: 'https://www.zillow.com/webservice/GetZestimate.htm',
		qs:  {
			'zpid':   zpId,
			'zws-id': zwsId,
		},
	});

	const {
		'Zestimate:zestimate': {
			message: {
				code,
				text,
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
		throw new StatusCodeError(code, text);
	}

	return { amount, date: lastUpdated.replace(/^(\d\d)\/(\d\d)\/(\d\d\d\d)$/, '$3-$1-$2') };
}
