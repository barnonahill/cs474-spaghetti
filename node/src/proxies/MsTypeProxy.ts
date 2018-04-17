import * as mst from '@src/models/msType';
import SpgProxy from '@src/proxies/SpgProxy';

/**
 * Proxy for communicating with the MsType Service
 */
export default class MsTypeProxy extends SpgProxy {
	constructor() {
		super('msType');
	}

	createMsType(msType: mst.MsType, callback: (msType: mst.MsType, err?: string) => void) {
		var params = {
			action: 'CreateMsType',
			msType: msType.toProperties()
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new mst.MsType(res as mst.Properties), null);
			}
		});
	}

	updateMsType(msType: mst.MsType, callback: (msType: mst.MsType, err?: string) => void) {
		var params = {
			action: 'UpdateMsType',
			msType: msType.toProperties()
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new mst.MsType(res as mst.Properties), null);
			}
		});
	}

	getMsType(msType: string, callback: (msType: mst.MsType, err?: string) => void) {
		var params = {
			action: 'CreateMsType',
			msType: msType
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new mst.MsType(res as mst.Properties), null);
			}
		});
	}

	getMsTypes(callback: (msTypes: Array<mst.MsType>, err?: string) => void) {
		var params = {
			action: 'GetMsTypes'
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else if (res.constructor === Array) {
				var msTypes: Array<mst.MsType> = [];
				for (let i = 0; i < res.length; i++) {
					msTypes.push(new mst.MsType(res as mst.Properties));
					callback(msTypes, null);
				}
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}
}
