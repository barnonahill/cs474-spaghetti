import * as cnty from '@src/models/century.ts';
import * as ctry from '@src/models/country.ts';
import * as crs from '@src/models/cursus.ts';
import * as sc from '@src/models/sourceCompleteness.ts';
import * as prv from '@src/models/provenance.ts';
import * as ntn from '@src/models/notation.ts';
import * as lib from '@src/models/Library.ts';
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

	createCentury(props: cnty.Properties, callback: (c: cnty.Century, err?: string) => void) {
		var params = {
			action: 'CreateCentury',
			century: props
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				callback(null, res.err);
			}
			else {
				callback(new cnty.Century(res as cnty.Properties), null);
			}
		});
	}

	getCentury(centuryID: string, callback: (century: cnty.Century, err?: string) => void) {
		var params = {
			action: 'GetCentury',
			centuryID: centuryID
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new cnty.Century(res as cnty.Properties), null);
			}
		});
	}

	getCenturies(callback: (centuries: Array<cnty.Century>, err?: string) => void) {
		var params = {
			action: 'GetCenturies'
		};

		super.doPost(params, (res: any) => {
			if (res.error) {
				SpgProxy.callbackError(callback, res.err);
			}
			else if (res.constructor === Array) {
				var centuries: Array<cnty.Century> = [];
				for (let i = 0; i < res.length; i++) {
					centuries.push(new cnty.Century(res[i] as cnty.Properties));
				}
				callback(centuries, null)
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
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
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
				return;
			}

			var data = res.data;
			if (data.constructor === Array) {
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

	createCursus(props: crs.Properties, callback: (c: crs.Cursus, err?: string) => void) {
		var params = {
			action: 'CreateCursus',
			cursus: props
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new crs.Cursus(res as crs.Properties), null);
			}
		});
	}

	getCursus(cursusID: string, callback: (c: crs.Cursus, err?: string) => void) {
		var params = {
			action: 'GetCursus',
			cursusID: cursusID
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new crs.Cursus(res as crs.Properties), null);
			}
		});
	}

	getCursuses(callback: (arr: Array<crs.Cursus>, err?: string) => void) {
		var params = {
			action: 'GetCursuses',
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else if (res.constructor === Array) {
				var arr: Array<crs.Cursus> = [];
				for (let i = 0; i < res.length; i++) {
					arr.push(new crs.Cursus(res[i] as crs.Properties), null);
				}
				callback(arr, null);
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
			library: props
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				callback(null, res.err);
			}
			else {
				callback(new lib.Library(res), null);
			}
		});
	}

	/**
	 * Asks the Library Service to update the library with a siglum matching l.
	 * @param l model of new library
	 * @param callback executed async when a response is received.
	 * @return
	 */
	updateLibrary(library: lib.Library, callback: (library: lib.Library, err?: string) => void) {
		var params = {
			action: 'UpdateLibrary',
			library: library.toProperties()
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
			}
			else {
				callback(new lib.Library((res as lib.Properties)), null);
			}
		});
	}

	/**
	 * Fetches the library with matching libSiglum
	 * @param libSiglum identifier for library, it cannot be null.
	 * @param callback executed async when a response is received.
	 * @return
	 */
	getLibrary(libSiglum: string, countryID: string,
		callback: (library: lib.Library, err?: string) => void)
	{
		var params = {
			action: 'GetLibrary',
			libSiglum: libSiglum
		};

		super.doPost(params, (res: any) => {
			if (res.err) {
				callback(null, res.err);
			}
			else {
				callback(new lib.Library(res), null);
			}
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
			if (res.err) {
				SpgProxy.callbackError(callback, res.err);
				return;
			}

			var data = res.data;
			if (data.constructor === Array) {
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
}
