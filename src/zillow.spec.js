import request from 'request-promise-native';

import { getZestimate } from './zillow';

jest.mock('request-promise-native');

beforeEach(() => {
	request.mockImplementation(() => Promise.resolve('<?xml version="1.0" encoding="utf-8"?><Zestimate:zestimate xsi:schemaLocation="http://www.zillow.com/static/xsd/Zestimate.xsd https://www.zillowstatic.com/vstatic/80d5e73/static/xsd/Zestimate.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:Zestimate="http://www.zillow.com/static/xsd/Zestimate.xsd"><request><zpid>ZPID</zpid></request><message><text>Request successfully processed</text><code>0</code></message><response><zpid>ZPID</zpid><links><homedetails>https://www.zillow.com/homedetails/918-Martin-Luther-King-Jr-Way-S-Seattle-WA-98144/ZPID_zpid/</homedetails><graphsanddata>http://www.zillow.com/homedetails/918-Martin-Luther-King-Jr-Way-S-Seattle-WA-98144/ZPID_zpid/#charts-and-data</graphsanddata><mapthishome>http://www.zillow.com/homes/ZPID_zpid/</mapthishome><comparables>http://www.zillow.com/homes/comps/ZPID_zpid/</comparables></links><address><street>918 Martin Luther King Jr Way S</street><zipcode>98144</zipcode><city>Seattle</city><state>WA</state><latitude>47.594018</latitude><longitude>-122.297479</longitude></address><zestimate><amount currency="USD">1000</amount><last-updated>01/02/2018</last-updated><oneWeekChange deprecated="true"></oneWeekChange><valueChange duration="30" currency="USD">1972</valueChange><valuationRange><low currency="USD">689539</low><high currency="USD">762121</high></valuationRange><percentile>86</percentile></zestimate><localRealEstate><region name="Leschi" id="271901" type="neighborhood"><zindexValue>862,000</zindexValue><links><overview>http://www.zillow.com/local-info/WA-Seattle/Leschi/r_271901/</overview><forSaleByOwner>http://www.zillow.com/leschi-seattle-wa/fsbo/</forSaleByOwner><forSale>http://www.zillow.com/leschi-seattle-wa/</forSale></links></region></localRealEstate><regions><zipcode-id>99595</zipcode-id><city-id>16037</city-id><county-id>207</county-id><state-id>59</state-id></regions></response></Zestimate:zestimate><!-- H:003  T:7ms  S:905  R:Mon Jul 08 01:13:15 PDT 2019  B:5.0.61033-master.e804620~delivery_ready.cd00c91 -->'));
});

afterEach(() => {
	jest.resetAllMocks();
});

describe('getZestimate', () => {
	it('gets the zestimate', async () => expect(await getZestimate({ zpId: 'ZPID', zwsId: 'ZWSID' })).toStrictEqual(expect.objectContaining({ amount: 1000, date: '2018-01-02' })));

	it('uses the correct options', async () => {
		await getZestimate({ zpId: 'ZPID', zwsId: 'ZWSID' });

		expect(request).toHaveBeenCalledWith({
			uri: 'https://www.zillow.com/webservice/GetZestimate.htm',
			qs:  {
				'zpid':   'ZPID',
				'zws-id': 'ZWSID',
			},
		});
	});

	it('rejects with xml code', async () => {
		request.mockImplementation(() => Promise.resolve('<?xml version="1.0" encoding="utf-8"?><Zestimate:zestimate xsi:schemaLocation="http://www.zillow.com/static/xsd/Zestimate.xsd https://www.zillowstatic.com/vstatic/80d5e73/static/xsd/Zestimate.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:Zestimate="http://www.zillow.com/static/xsd/Zestimate.xsd"><request><zpid>ZPID</zpid></request><message><text>Error: Some Error Message</text><code>1</code></message></Zestimate:zestimate><!-- H:003  T:5ms  S:115  R:Mon Jul 08 01:31:08 PDT 2019  B:5.0.61033-master.e804620~delivery_ready.cd00c91 -->'));

		await expect(getZestimate({ zpId: 'ZPID', zwsId: 'ZWSID' })).rejects.toHaveProperty('statusCode', 1);
	});
});
