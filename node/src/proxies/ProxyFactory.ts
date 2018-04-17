import CenturyProxy from './CenturyProxy';
import CountryProxy from './CountryProxy';
import FeastProxy from './FeastProxy';
import LibraryProxy from './LibraryProxy';
import MsTypeProxy from './MsTypeProxy';


/**
 * ProxyFactory is a factory-singleton for accessing the various data proxies as singletons.
 *
 * @author Paul Barnhill
 * @version 2018-04-16
 */
class ProxyFactory {
	private centuryProxy: CenturyProxy;
	private countryProxy: CountryProxy;
	private feastProxy: FeastProxy;
	private libraryProxy: LibraryProxy;
	private MsTypeProxy: MsTypeProxy;

	constructor() {}

	/**
	 * Gets the centuryProxy singleton.
	 */
	getCenturyProxy(): CenturyProxy {
		if (!this.centuryProxy) {
			this.centuryProxy = new CenturyProxy();
		}
		return this.centuryProxy;
	}

	/**
	 * Gets the countryProxy singleton.
	 */
	getCountryProxy(): CountryProxy {
		if (!this.countryProxy) {
			this.countryProxy = new CountryProxy();
		}
		return this.countryProxy;
	}

	/**
	 * Gets the feastProxy singleton.
	 */
	getFeastProxy(): FeastProxy {
		if (!this.feastProxy) {
			this.feastProxy = new FeastProxy();
		}
		return this.feastProxy;
	}

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
	 * Gets the msTypeProxy singleton.
	 */
	getMsTypeProxy(): MsTypeProxy {
		if (!this.MsTypeProxy) {
			this.MsTypeProxy = new MsTypeProxy();
		}
		return this.MsTypeProxy;
	}
}

// export a factory singleton
const factory = new ProxyFactory();
export default factory;
