import * as lib from '@src/models/Library';
import SpgProxy from '@src/proxies/SpgProxy';

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
	 * Creates a library with the parameter properties.
	 * @param props Attributes of new library
	 * @param callback executed when a response is received.
	 */
	createLibrary(library: lib.Library, callback: (library: lib.Library, err?: string) => void) {
		var params = {
			action: 'CreateLibrary',
			library: library.toProperties()
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
	getLibrary(libSiglum: string, callback: (library: lib.Library, err?: string) => void) {
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
			}
			else if (res.constructor === Array) {
				var libraries: Array<lib.Library> = [];
				for (let i = 0; i < res.length; i++) {
					libraries.push(new lib.Library(res[i]));
				}
				callback(libraries, null);
			}
			else {
				SpgProxy.callbackError(callback, null);
			}
		});
	}
}
