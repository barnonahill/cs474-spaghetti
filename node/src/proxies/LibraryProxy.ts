import * as cnty from '@src/models/century.ts';
import * as ctry from '@src/models/country.ts';
import * as crs from '@src/models/cursus.ts';
import * as sc from '@src/models/sourceCompleteness.ts';
import * as prv from '@src/models/provenance.ts';
import * as ntn from '@src/models/notation.ts';
import * as lib from '@src/models/library.ts';
import SpgProxy from '@src/proxies/SpgProxy.ts';

/**
 * Proxy for communicating with the Library Service.
 *
 * @author Paul Barnhill
 * @version 2018-04-16
 */
export default class LibraryProxy extends SpgProxy {
	constructor() {
		super('library');
	}

	/**
	 * Fetches all countries from the back-end
	 * @param callback executed async when a response is received
	 */
	getCountries(callback: (countries: Array<ctry.Country>, err?: string) => void) {
		var params = {
			action:'GetCountries'
		};

		super.doPost(params, (res: any) => {
			var data:any = res.data;
			if (data.err) {
				SpgProxy.callbackError(callback, data.err);
			}
			else if (data.constructor === Array) {
				var countries: Array<ctry.Country> = data.map((props: ctry.Properties) => {
					return new ctry.Country(props);
				});
				callback(countries, null);
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}

	getLibrary(libSiglum:string, callback:(l:lib.Library, e?:string) => void) {
		var params = {
			action: 'GetLibrary',
			libSiglum: libSiglum
		};

		super.doPost(params, (res:any) => {
			var d = res.data;
			if (d.err) {
				return SpgProxy.callbackError(callback, d.err);
			}

			callback(new lib.Library(d as lib.Properties), null);
		});
	}

	/**
	 * Fetches the libraries from the back-end
	 * @param countryID to filter by, it can be null.
	 * @param callback executed async when a response is received.
	 * @return
	 */
	getLibraries(countryID: string, callback: (libraries: Array<lib.Library>, err?: string) => void) {
		var params = {
			action: 'GetLibraries',
			countryID: countryID
		};

		super.doPost(params, (res: any) => {
			var data:any = res.data;
			if (data.err) {
				SpgProxy.callbackError(callback, data.err);
			}
			else if (data.constructor === Array) {
				var libraries: Array<lib.Library> = data.map((props: lib.Properties) => {
					return new lib.Library(props);
				});
				callback(libraries, null);
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}

	/**
	 * Creates a library with the parameter properties.
	 * @param props Attributes of new library
	 * @param callback executed when a response is received.
	 */
	createLibrary(props: lib.Properties, callback: (library: lib.Library, err?: string) => void) {
		var params = {
			action: 'CreateLibrary',
		};
		Object.assign(params, props);

		super.doPost(params, (res: any) => {
			var data:any = res.data;
			if (data.err) {
				SpgProxy.callbackError(callback, data.err);
			}
			else if (data.libSiglum) {
				callback(new lib.Library(data as lib.Properties), null);
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}

	/**
	 * Asks the Library Service to update the library with a siglum matching l.
	 * @param l model of new library
	 * @param callback executed async when a response is received.
	 * @return
	 */
	updateLibrary(props: lib.Properties, callback: (library: lib.Library, err?: string) => void) {
		var params = {
			action: 'UpdateLibrary',
		};
		Object.assign(params, props);

		super.doPost(params, (res: any) => {
			var data:any = res.data;
			if (data.err) {
				SpgProxy.callbackError(callback, data.err);
			}
			else if (data.libSiglum) {
				callback(new lib.Library(data as lib.Properties), null);
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}

	deleteLibrary(libSiglum: string, callback: (success:boolean, err?: string) => void) {
		var params  = {
			action: 'DeleteLibrary',
			libSiglum: libSiglum
		};

		super.doPost(params, (res: any) => {
			var data:any = res.data;
			if (data.err) {
				SpgProxy.callbackError(callback, data.err);
			}
			else {
				callback(data.success ? true:false, null);
			}
		});
	}
}
