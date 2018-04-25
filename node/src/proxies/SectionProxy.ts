import * as cty from '@src/models/century.ts';
import * as crs from '@src/models/cursus.ts';
import * as sc from '@src/models/sourceCompleteness.ts';
import * as sn from '@src/models/section.ts';
import SpgProxy from '@src/proxies/SpgProxy.ts';

export default class SectionProxy extends SpgProxy {
	constructor() {
		super('section');
	}

	getCenturies(callback: (centuries:cty.Century[], e?:string) => void) {
		var params = {action:'GetCenturies'};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.e) {
				SpgProxy.callbackError(callback, d.e);
			}
			else if (d.constructor === Array) {
				callback(d.map((p:cty.Properties) => new cty.Century(p), null));
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}

	getCursuses(callback: (cursuses:crs.Cursus[], e?:string) => void) {
		var params = {action:'GetCursuses'};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.e) {
				SpgProxy.callbackError(callback, d.e);
			}
			else if (d.constructor === Array) {
				callback(d.map((p:crs.Properties) => new crs.Cursus(p), null));
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}

	getCursuses(callback: (cursuses:crs.Cursus[], e?:string) => void) {
		var params = {action:'GetCursuses'};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.e) {
				SpgProxy.callbackError(callback, d.e);
			}
			else if (d.constructor === Array) {
				callback(d.map((p:crs.Properties) => new crs.Cursus(p), null));
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}
}
