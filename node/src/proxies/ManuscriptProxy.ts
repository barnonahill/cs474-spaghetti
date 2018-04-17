import * as ms from '@src/models/manuscript';
import * as mst from '@src/models/msType';
import SpgProxy from '@src/proxies/SpgProxy';

export default class ManuScriptProxy extends SpgProxy {
	constructor() {
		super('manuscript');
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

	createManuscript(props: ms.Properties, callback: (manuscript: ms.Manuscript, err?: string) => void) {
		var params = {
			action: 'CreateManuscript',
			manuscript: props
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new ms.Manuscript(res as ms.Properties), null);
			}
		});
	}

	updateManuscript(props: ms.Properties, callback: (manuscript: ms.Manuscript, err?: string) => void) {
		var params = {
			action: 'UpdateManuscript',
			manuscript: props
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new ms.Manuscript(res as ms.Properties), null);
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
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new ms.Manuscript(res as ms.Properties), null);
			}
		});
	}

	getManuscripts(callback: (manuscripts: Array<ms.Manuscript>, err?: string) => void) {
		var params = {
			action: 'GetManuscripts'
		};

		super.doPost(params, (res:any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else if (res.constructor === Array) {
				var manuscripts: Array<ms.Manuscript> = [];
				for (let i = 0; i < res.length; i++) {
					manuscripts.push(new ms.Manuscript(res[i] as ms.Properties));
				}
				callback(manuscripts, null);
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}
}
