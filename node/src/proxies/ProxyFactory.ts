import LibraryProxy from './LibraryProxy.ts';
import ManuScriptProxy from './ManuscriptProxy.ts';


/**
 * ProxyFactory is a factory-singleton for accessing the various data proxies as singletons.
 *
 * @author Paul Barnhill
 * @version 2018-04-16
 */
class ProxyFactory {
	private libraryProxy: LibraryProxy;
	private manuscriptProxy: ManuScriptProxy;

	constructor() {}

	/**
	 * Gets the libraryProxy singleton.
	 */
	getLibraryProxy(): LibraryProxy {
		if (!this.libraryProxy) {
			this.libraryProxy = new LibraryProxy();
		}
		return this.libraryProxy;
	}

	/**
	 * Gets the manuscriptProxy singleton.
	 */
	getManuscriptProxy(): ManuScriptProxy {
		if (!this.manuscriptProxy) {
			this.manuscriptProxy = new ManuScriptProxy();
		}
		return this.manuscriptProxy;
	}
}

// export a factory singleton
const factory = new ProxyFactory();
export default factory;
