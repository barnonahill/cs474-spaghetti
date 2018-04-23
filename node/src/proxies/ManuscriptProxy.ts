import * as ms from '@src/models/manuscript.ts';
import * as mst from '@src/models/msType.ts';
import SpgProxy from '@src/proxies/SpgProxy.ts';

export default class ManuScriptProxy extends SpgProxy {
	constructor() {
		super('manuscript');
	}

	getManuscripts(countryID:string, libSiglum:string, callback: (manuscripts: Array<ms.Manuscript>, err?: string) => void) {
		var params = {
			action: 'GetManuscripts',
			countryID: countryID || null,
			libSiglum: libSiglum || null
		};

		super.doPost(params, (res:any) => {
			var d = res.data;
			if (d.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else if (d.constructor === Array) {
				var manuscripts: Array<ms.Manuscript> = d.map((p:ms.Properties) => {
					return new ms.Manuscript(p);
				});
				callback(manuscripts, null);
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}

	createMsType(props: mst.Properties, callback: (mt: mst.MsType, err?: string) => void) {
		var params = {
			action: 'CreateMsType',
		};
		Object.assign(params, props);

		super.doPost(params, (res: any) => {
			var data = res.data;
			if (data.err) {
				SpgProxy.callbackError(callback, data.err);
			}
			else {
				callback(new mst.MsType(data as mst.Properties), null);
			}
		});
	}

	updateMsType(props: mst.Properties, callback: (mt: mst.MsType, err?: string) => void) {
		var params = {
			action: 'UpdateMsType',
		};
		Object.assign(params, props);

		super.doPost(params, (res: any) => {
			var data = res.data;
			if (data.err) {
				SpgProxy.callbackError(callback, data.err);
			}
			else {
				callback(new mst.MsType(data as mst.Properties), null);
			}
		});
	}

	getMsType(msType: string, callback: (mt: mst.MsType, err?: string) => void) {
		var params = {
			action: 'CreateMsType',
			msType: msType
		};

		super.doPost(params, (res: any) => {
			var d = res.data;
			if (d.err) {
				SpgProxy.callbackError(callback, d.err);
			}
			else {
				callback(new mst.MsType(d as mst.Properties), null);
			}
		});
	}

	getMsTypes(callback: (msTypes: Array<mst.MsType>, err?: string) => void) {
		var params = {
			action: 'GetMsTypes'
		};

		super.doPost(params, (res: any) => {
			var d = res.data;
			if (d.err) {
				SpgProxy.callbackError(callback, d.err);
			}
			else if (d.constructor === Array) {
				var msTypes: Array<mst.MsType> = d.map((p: mst.Properties) => {
					return new mst.MsType(p);
				});
				callback(msTypes, null);
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}

	createManuscript(props: ms.Properties, callback: (mst: ms.Manuscript, err?: string) => void) {
		var params = {
			action: 'CreateManuscript',
		};
		Object.assign(params, props);

		super.doPost(params, (res: any) => {
			var d = res.data;
			if (d.err) {
				SpgProxy.callbackError(callback, d.err);
			}
			else {
				callback(new ms.Manuscript(d as ms.Properties), null);
			}
		});
	}

	updateManuscript(props: ms.Properties, callback: (manuscript: ms.Manuscript, err?: string) => void) {
		var params = {
			action: 'UpdateManuscript',
		};
		Object.assign(params, props);

		super.doPost(params, (res: any) => {
			var d = res.data;
			if (d.err) {
				SpgProxy.callbackError(callback, d.err);
			}
			else {
				callback(new ms.Manuscript(d as ms.Properties), null);
			}
		});
	}

	getManuscript(libSiglum: string, msSiglum: string,
		callback: (manuscript: ms.Manuscript, err?: string) => void)
	{
		var params = {
			action: 'GetManuscript',
			libSiglum: libSiglum,
			msSiglum: msSiglum
		};

		super.doPost(params, (res:any) => {
			var d = res.data;
			if (d.err) {
				SpgProxy.callbackError(callback, d.err);
			}
			else {
				callback(new ms.Manuscript(d as ms.Properties), null);
			}
		});
	}
}
