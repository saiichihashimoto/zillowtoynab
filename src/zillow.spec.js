import request from 'request-promise-native';
import { getZestimate } from './zillow';

jest.mock('request-promise-native');

describe('zillow', () => {
	const ZPID = 9999999;

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getZestimate', () => {
		it('gets the zestimate', () => {
			request.mockImplementation(() => Promise.resolve('<?xml version="1.0" encoding="utf-8"?><Zestimate:zestimate xsi:schemaLocation="http://www.zillow.com/static/xsd/Zestimate.xsd https://www.zillowstatic.com/vstatic/80d5e73/static/xsd/Zestimate.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:Zestimate="http://www.zillow.com/static/xsd/Zestimate.xsd"><request><zpid>9999999</zpid></request><message><text>Request successfully processed</text><code>0</code></message><response><zpid>9999999</zpid><links><homedetails>https://www.zillow.com/homedetails/918-Martin-Luther-King-Jr-Way-S-Seattle-WA-98144/9999999_zpid/</homedetails><graphsanddata>http://www.zillow.com/homedetails/918-Martin-Luther-King-Jr-Way-S-Seattle-WA-98144/9999999_zpid/#charts-and-data</graphsanddata><mapthishome>http://www.zillow.com/homes/9999999_zpid/</mapthishome><comparables>http://www.zillow.com/homes/comps/9999999_zpid/</comparables></links><address><street>918 Martin Luther King Jr Way S</street><zipcode>98144</zipcode><city>Seattle</city><state>WA</state><latitude>47.594018</latitude><longitude>-122.297479</longitude></address><zestimate><amount currency="USD">1000</amount><last-updated>01/01/2000</last-updated><oneWeekChange deprecated="true"></oneWeekChange><valueChange duration="30" currency="USD">1972</valueChange><valuationRange><low currency="USD">689539</low><high currency="USD">762121</high></valuationRange><percentile>86</percentile></zestimate><localRealEstate><region name="Leschi" id="271901" type="neighborhood"><zindexValue>862,000</zindexValue><links><overview>http://www.zillow.com/local-info/WA-Seattle/Leschi/r_271901/</overview><forSaleByOwner>http://www.zillow.com/leschi-seattle-wa/fsbo/</forSaleByOwner><forSale>http://www.zillow.com/leschi-seattle-wa/</forSale></links></region></localRealEstate><regions><zipcode-id>99595</zipcode-id><city-id>16037</city-id><county-id>207</county-id><state-id>59</state-id></regions></response></Zestimate:zestimate><!-- H:003  T:7ms  S:905  R:Mon Jul 08 01:13:15 PDT 2019  B:5.0.61033-master.e804620~delivery_ready.cd00c91 -->'));

			return expect(getZestimate(ZPID)).resolves.toEqual(expect.objectContaining({ amount: 1000, date: '01/01/2000' }));
		});

		it('rejects with 500 on 1', () => {
			request.mockImplementation(() => Promise.resolve('<?xml version="1.0" encoding="utf-8"?><Zestimate:zestimate xsi:schemaLocation="http://www.zillow.com/static/xsd/Zestimate.xsd https://www.zillowstatic.com/vstatic/80d5e73/static/xsd/Zestimate.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:Zestimate="http://www.zillow.com/static/xsd/Zestimate.xsd"><request><zpid>9999999</zpid></request><message><text>Error: Some Error Message</text><code>1</code></message></Zestimate:zestimate><!-- H:003  T:5ms  S:115  R:Mon Jul 08 01:31:08 PDT 2019  B:5.0.61033-master.e804620~delivery_ready.cd00c91 -->'));

			return expect(getZestimate(ZPID)).rejects.toHaveProperty('code', 500);
		});

		it('rejects with 500 on 2', () => {
			request.mockImplementation(() => Promise.resolve('<?xml version="1.0" encoding="utf-8"?><Zestimate:zestimate xsi:schemaLocation="http://www.zillow.com/static/xsd/Zestimate.xsd https://www.zillowstatic.com/vstatic/80d5e73/static/xsd/Zestimate.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:Zestimate="http://www.zillow.com/static/xsd/Zestimate.xsd"><request><zpid>9999999</zpid></request><message><text>Error: Some Error Message</text><code>2</code></message></Zestimate:zestimate><!-- H:003  T:5ms  S:115  R:Mon Jul 08 01:31:08 PDT 2019  B:5.0.61033-master.e804620~delivery_ready.cd00c91 -->'));

			return expect(getZestimate(ZPID)).rejects.toHaveProperty('code', 500);
		});

		it('rejects with 502 on 3', () => {
			request.mockImplementation(() => Promise.resolve('<?xml version="1.0" encoding="utf-8"?><Zestimate:zestimate xsi:schemaLocation="http://www.zillow.com/static/xsd/Zestimate.xsd https://www.zillowstatic.com/vstatic/80d5e73/static/xsd/Zestimate.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:Zestimate="http://www.zillow.com/static/xsd/Zestimate.xsd"><request><zpid>9999999</zpid></request><message><text>Error: Some Error Message</text><code>3</code></message></Zestimate:zestimate><!-- H:003  T:5ms  S:115  R:Mon Jul 08 01:31:08 PDT 2019  B:5.0.61033-master.e804620~delivery_ready.cd00c91 -->'));

			return expect(getZestimate(ZPID)).rejects.toHaveProperty('code', 502);
		});

		it('rejects with 502 on 4', () => {
			request.mockImplementation(() => Promise.resolve('<?xml version="1.0" encoding="utf-8"?><Zestimate:zestimate xsi:schemaLocation="http://www.zillow.com/static/xsd/Zestimate.xsd https://www.zillowstatic.com/vstatic/80d5e73/static/xsd/Zestimate.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:Zestimate="http://www.zillow.com/static/xsd/Zestimate.xsd"><request><zpid>9999999</zpid></request><message><text>Error: Some Error Message</text><code>4</code></message></Zestimate:zestimate><!-- H:003  T:5ms  S:115  R:Mon Jul 08 01:31:08 PDT 2019  B:5.0.61033-master.e804620~delivery_ready.cd00c91 -->'));

			return expect(getZestimate(ZPID)).rejects.toHaveProperty('code', 502);
		});

		it('rejects with 404 on 500', () => {
			request.mockImplementation(() => Promise.resolve('<?xml version="1.0" encoding="utf-8"?><Zestimate:zestimate xsi:schemaLocation="http://www.zillow.com/static/xsd/Zestimate.xsd https://www.zillowstatic.com/vstatic/80d5e73/static/xsd/Zestimate.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:Zestimate="http://www.zillow.com/static/xsd/Zestimate.xsd"><request><zpid>9999999</zpid></request><message><text>Error: Some Error Message</text><code>500</code></message></Zestimate:zestimate><!-- H:003  T:5ms  S:115  R:Mon Jul 08 01:31:08 PDT 2019  B:5.0.61033-master.e804620~delivery_ready.cd00c91 -->'));

			return expect(getZestimate(ZPID)).rejects.toHaveProperty('code', 404);
		});

		it('rejects with 404 on 501', () => {
			request.mockImplementation(() => Promise.resolve('<?xml version="1.0" encoding="utf-8"?><Zestimate:zestimate xsi:schemaLocation="http://www.zillow.com/static/xsd/Zestimate.xsd https://www.zillowstatic.com/vstatic/80d5e73/static/xsd/Zestimate.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:Zestimate="http://www.zillow.com/static/xsd/Zestimate.xsd"><request><zpid>9999999</zpid></request><message><text>Error: Some Error Message</text><code>501</code></message></Zestimate:zestimate><!-- H:003  T:5ms  S:115  R:Mon Jul 08 01:31:08 PDT 2019  B:5.0.61033-master.e804620~delivery_ready.cd00c91 -->'));

			return expect(getZestimate(ZPID)).rejects.toHaveProperty('code', 404);
		});

		it('rejects with 404 on 502', () => {
			request.mockImplementation(() => Promise.resolve('<?xml version="1.0" encoding="utf-8"?><Zestimate:zestimate xsi:schemaLocation="http://www.zillow.com/static/xsd/Zestimate.xsd https://www.zillowstatic.com/vstatic/80d5e73/static/xsd/Zestimate.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:Zestimate="http://www.zillow.com/static/xsd/Zestimate.xsd"><request><zpid>9999999</zpid></request><message><text>Error: Some Error Message</text><code>502</code></message></Zestimate:zestimate><!-- H:003  T:5ms  S:115  R:Mon Jul 08 01:31:08 PDT 2019  B:5.0.61033-master.e804620~delivery_ready.cd00c91 -->'));

			return expect(getZestimate(ZPID)).rejects.toHaveProperty('code', 404);
		});
	});
});
