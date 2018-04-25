import * as ms from '@src/models/manuscript.ts';
import * as mst from '@src/models/msType.ts';
import SpgProxy from '@src/proxies/SpgProxy.ts';

export default class ManuScriptProxy extends SpgProxy {
	constructor() {
		super('manuscript');
	}

	getManuscript(libSiglum:string, msSiglum:string, callback:(m:ms.Manuscript, e?:string) => void) {
		var params = {
			action: 'GetManuscript',
			libSiglum: libSiglum,
			msSiglum: msSiglum
		};

		super.doPost(params, (res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, res.err);
			}
			callback(new ms.Manuscript(d as ms.Properties), null);
		})
	}

	getManuscripts(countryID:string, libSiglum:string, callback: (manuscripts: Array<ms.Manuscript>, err?: string) => void) {
		var params:any = {
			action: 'GetManuscripts',
			countryID: countryID,
			libSiglum: libSiglum
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

	deleteManuscript(libSiglum:string, msSiglum:string, callback:(success:boolean, e?:string) => void) {
		var params = {
			action: 'DeleteManuscript',
			libSiglum: libSiglum,
			msSiglum: msSiglum
		};

		super.doPost(params, (res:any) => {
			var d = res.data;
			if (d.err) {
				SpgProxy.callbackError(callback, d.err);
			}
			else {
				callback(d.success ? true:false, null);
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

	deleteMsType(msType: string, callback: (success:boolean, e?:string) => void) {
		var params = {
			action: 'DeleteMsType',
			msType: msType
		};

		super.doPost(params, (res:any) => {
			var d = res.data;
			if (d.err) {
				SpgProxy.callbackError(callback, d.err);
			}
			else {
				callback(d.success ? true:false, null);
			}
		});
	}
}
