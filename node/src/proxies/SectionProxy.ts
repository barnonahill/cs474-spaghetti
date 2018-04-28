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

	createSection(p:sn.Properties, callback: (s:sn.Section, e?:string) => void) {
		var params:any = {
			action: 'CreateSection'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.e) {
				return SpgProxy.callbackError(callback, d.e);
			}

			callback(new sn.Section(d), null);
		});
	}

	updateSection(p:sn.Properties, callback: (s:sn.Section, e?:string) => void) {
		var params:any = {
			action: 'UpdateSection'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.e) {
				return SpgProxy.callbackError(callback, d.e);
			}

			callback(new sn.Section(d), null);
		});
	}

	deleteSection(libSiglum:string, msSiglum:string, sectionID:number,
		callback: (s:boolean, e?:string) => void)
	{
		var params:any = {
			action: 'DeleteSection',
			libSiglum: libSiglum,
			msSiglum: msSiglum,
			sectionID: sectionID
		};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.e) {
				return SpgProxy.callbackError(callback, d.e);
			}

			callback(Boolean(d.success), null);
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

	createCentury(p:cty.Properties, callback: (c: cty.Century, e?:string) => void) {
		var params:any = {
			action: 'CreateCentury'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new cty.Century(d as cty.Properties), null);
		});
	}

	updateCentury(p:cty.Properties, callback: (c: cty.Century, e?:string) => void) {
		var params:any = {
			action: 'UpdateCentury'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new cty.Century(d as cty.Properties), null);
		});
	}

	deleteCentury(centuryID: string, callback: (s:boolean, e?:string) => void) {
		var params:any = {
			action: 'DeleteCentury',
			centuryID: centuryID
		};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}
			callback(Boolean(d.success), null);
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

	createCursus(p:crs.Properties, callback: (c: crs.Cursus, e?:string) => void) {
		var params:any = {
			action: 'CreateCursus'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new crs.Cursus(d as crs.Properties), null);
		});
	}

	updateCursus(p:crs.Properties, callback: (c: crs.Cursus, e?:string) => void) {
		var params:any = {
			action: 'UpdateCursus'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new crs.Cursus(d as crs.Properties), null);
		});
	}

	deleteCursus(cursusID: string, callback: (s:boolean, e?:string) => void) {
		var params:any = {
			action: 'DeleteCursus',
			cursusID: cursusID
		};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}
			callback(Boolean(d.success), null);
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

	createSourceCompleteness(p:sc.Properties,
		callback: (sc: sc.SourceCompleteness, e?:string) => void)
	{
		var params:any = {
			action: 'CreateSourceCompleteness'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new sc.SourceCompleteness(d as sc.Properties), null);
		});
	}

	updateSourceCompleteness(p:sc.Properties,
		callback: (sc: sc.SourceCompleteness, e?:string) => void) {
		var params:any = {
			action: 'UpdateSourceCompleteness'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new sc.SourceCompleteness(d as sc.Properties), null);
		});
	}

	deleteSourceCompleteness(scID: string, callback: (s:boolean, e?:string) => void) {
		var params:any = {
			action: 'DeleteSourceCompleteness',
			sourceCompletenessID: scID
		};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}
			callback(Boolean(d.success), null);
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

	createProvenance(p:prv.Properties, callback: (prv: prv.Provenance, e?:string) => void) {
		var params:any = {
			action: 'CreateProvenance'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new prv.Provenance(d as prv.Properties), null);
		});
	}

	updateProvenance(p:prv.Properties, callback: (prv: prv.Provenance, e?:string) => void) {
		var params:any = {
			action: 'UpdateProvenance'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new prv.Provenance(d as prv.Properties), null);
		});
	}

	deleteProvenance(pID: string, callback: (s:boolean, e?:string) => void) {
		var params:any = {
			action: 'DeleteProvenance',
			provenanceID: pID
		};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}
			callback(Boolean(d.success), null);
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

	createNotation(p:nt.Properties, callback: (prv: nt.Notation, e?:string) => void) {
		var params:any = {
			action: 'CreateNotation'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new nt.Notation(d as nt.Properties), null);
		});
	}

	updateNotation(p:nt.Properties, callback: (prv: nt.Notation, e?:string) => void) {
		var params:any = {
			action: 'UpdateNotation'
		};
		Object.assign(params, p);

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new nt.Notation(d as nt.Properties), null);
		});
	}

	deleteNotation(nID: string, callback: (s:boolean, e?:string) => void) {
		var params:any = {
			action: 'DeleteNotation',
			notationID: nID
		};

		super.doPost(params,(res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}
			callback(Boolean(d.success), null);
		});
	}
}
