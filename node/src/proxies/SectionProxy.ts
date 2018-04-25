import * as cty from '@src/models/century.ts';
import * as crs from '@src/models/cursus.ts';
import * as sc from '@src/models/sourceCompleteness.ts';
import * as prv from '@src/models/provenance.ts';
import * as nt from '@src/models/notation.ts';
import * as sn from '@src/models/section.ts';
import SpgProxy from '@src/proxies/SpgProxy.ts';

export default class SectionProxy extends SpgProxy {
	constructor() {
		super('section');
	}

	getSections(libSiglum:string, msSiglum:string,
		callback: (sections:sn.Section[], e?:string) => void)
	{
		var params = {
			action: 'GetSections',
			libSiglum: libSiglum,
			msSiglum: msSiglum
		};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.e) {
				SpgProxy.callbackError(callback, d.e);
			}
			else if (d.constructor === Array) {
				callback(d.map((p:sn.Properties) => new sn.Section(p), null));
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
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

	getSourceCompletenesses(callback: (srcComps:sc.SourceCompleteness[], e?:string) => void) {
		var params = {action:'GetSourceCompletenesses'};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.e) {
				SpgProxy.callbackError(callback, d.e);
			}
			else if (d.constructor === Array) {
				callback(d.map((p:sc.Properties) => new sc.SourceCompleteness(p), null));
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}

	getProvenances(callback: (provs:prv.Provenance[], e?:string) => void) {
		var params = {action:'GetProvenances'};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.e) {
				SpgProxy.callbackError(callback, d.e);
			}
			else if (d.constructor === Array) {
				callback(d.map((p:prv.Properties) => new prv.Provenance(p), null));
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}

	getNotations(callback: (notes:nt.Notation[], e?:string) => void) {
		var params = {action:'GetNotations'};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.e) {
				SpgProxy.callbackError(callback, d.e);
			}
			else if (d.constructor === Array) {
				callback(d.map((p:nt.Properties) => new nt.Notation(p), null));
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}
}
