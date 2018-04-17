import * as fst from '@src/models/feast';
import SpgProxy from '@src/proxies/SpgProxy';

/**
 * Proxy for communicating with the Feast Service.
 *
 * @author Paul Barnhill
 * @version 2018-04-16
 */
export default class FeastProxy extends SpgProxy {
	constructor() {
		super('feast');
	}

	createFeast(feast: fst.Feast, callback: (feast: fst.Feast, err?: string) => void) {
		var params = {
			action: 'CreateFeast',
			feast: feast.toProperties()
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new fst.Feast((res as fst.Properties)), null);
			}
		});
	}

	updateFeast(feast: fst.Feast, callback: (feast: fst.Feast, err?: string) => void) {
		var params = {
			action: 'UpdateFeast',
			feast: feast.toProperties()
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new fst.Feast((res as fst.Properties)), null);
			}
		});
	}

	getFeast(feastID: string, callback: (feast: fst.Feast, err?: string) => void) {
		var params = {
			action: 'GetFeast',
			feastID: feastID
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new fst.Feast((res as fst.Properties)), null);
			}
		});
	}

	getFeasts(callback: (feasts: Array<fst.Feast>, err?: string) => void) {
		var params = {
			action: 'GetFeasts'
		};
		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else if (res.constructor === Array) {
				var feasts: Array<fst.Feast> = [];
				for (let i = 0; i < res.length; i++) {
					feasts.push(new fst.Feast(res[i] as fst.Properties));
				}
				callback(feasts, null);
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}
}
