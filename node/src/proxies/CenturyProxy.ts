import * as cty from '@src/models/century';
import SpgProxy from '@src/proxies/SpgProxy';

/**
 * Proxy for communicating with the Century Service.
 *
 * @author Paul Barnhill
 * @version 2018-04-16
 */
export default class CenturyProxy extends SpgProxy {
	constructor() {
		super('century');
	}

	getCentury(centuryID: string, callback: (century: cty.Century, err?: string) => void) {
		var params = {
			action: 'GetCentury',
			centuryID: centuryID
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new cty.Century(res as cty.Properties), null);
			}
		});
	}

	getCenturies(callback: (centuries: Array<cty.Century>, err?: string) => void) {
		var params = {
			action: 'GetCenturies'
		};

		super.doPost(params, (res: any) => {
			if (res.error) {
				SpgProxy.callbackError(callback, res.err);
			}
			else if (res.constructor === Array) {
				var centuries: Array<cty.Century> = [];
				for (let i = 0; i < res.length; i++) {
					centuries.push(new cty.Century(res[i] as cty.Properties));
				}
				callback(centuries, null)
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}
}
