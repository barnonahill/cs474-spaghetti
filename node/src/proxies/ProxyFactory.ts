import LibraryProxy from '@src/proxies/LibraryProxy.ts';
import ManuscriptProxy from '@src/proxies/ManuscriptProxy.ts';
import SectionProxy from '@src/proxies/SectionProxy.ts';


/**
 * ProxyFactory is a factory-singleton for accessing the various data proxies as singletons.
 *
 * @author Paul Barnhill
 * @version 2018-04-25
 */
class ProxyFactory {
	private libraryProxy: LibraryProxy;
	private manuscriptProxy: ManuscriptProxy;
	private sectionProxy: SectionProxy;

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
	getManuscriptProxy(): ManuscriptProxy {
		if (!this.manuscriptProxy) {
			this.manuscriptProxy = new ManuscriptProxy();
		}
		return this.manuscriptProxy;
	}

	getSectionProxy(): SectionProxy {
		if (!this.sectionProxy) {
			this.sectionProxy = new SectionProxy();
		}
		return this.sectionProxy;
	}
}

// export a factory singleton
export default new ProxyFactory();
