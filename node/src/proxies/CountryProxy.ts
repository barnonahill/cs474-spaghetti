import * as country from '@src/models/country';
import SpgProxy from '@src/proxies/SpgProxy';


/**
 * Proxy for communicating with the Country Service.
 *
 * @author Paul Barnhill
 * @version 2018-04-16
 */
export default class CountryProxy extends SpgProxy {
	constructor() {
		super('country');
	}

	/**
	 * Fetches the country with countryID countryID from the back-end
	 * @param countryID identifier for the country, cannot be null.
	 * @param callback executed async when a response is received.
	 */
	getCountry(countryID: string, callback: (country: country.Country, err?: string) => void) {
		var params = {
			action: 'GetCountry',
			countryID: countryID
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new country.Country((res as country.Properties)), null);
			}
		});
	}

	/**
	 * Fetches all countries from the back-end
	 * @param callback executed async when a response is received
	 */
	getCountries(callback: (countries: Array<country.Country>, err?: string) => void) {
		var params = {
			action:'GetCountries'
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else if (res.constructor === Array) {
				var countries: Array<country.Country> = [];
				for (let i = 0; i < res.length; i++) {
					countries.push(new country.Country((res[i] as country.Properties)));
				}
				callback(countries, null);
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}
}
