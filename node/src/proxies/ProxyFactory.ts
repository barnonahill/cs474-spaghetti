import CountryProxy from './CountryProxy';
import FeastProxy from './FeastProxy';
import LibraryProxy from './LibraryProxy';
import MsTypeProxy from './MsTypeProxy';


/**
 * ProxyFactory is a singleton for accessing the various data proxies as singletons.
 *
 * @author Paul Barnhill
 * @version 2018-04-16
 */
class ProxyFactory {
	private countryProxy: CountryProxy;
	private feastProxy: FeastProxy;
	private libraryProxy: LibraryProxy;
	private MsTypeProxy: MsTypeProxy;

	constructor() {}

	getCountryProxy(): CountryProxy {
		if (!this.countryProxy) {
			this.countryProxy = new CountryProxy();
		}
		return this.countryProxy;
	}

	getFeastProxy(): FeastProxy {
		if (!this.feastProxy) {
			this.feastProxy = new FeastProxy();
		}
		return this.feastProxy;
	}

	getLibraryProxy(): LibraryProxy {
		if (!this.libraryProxy) {
			this.libraryProxy = new LibraryProxy();
		}
		return this.libraryProxy;
	}

	getMsTypeProxy(): MsTypeProxy {
		if (!this.MsTypeProxy) {
			this.MsTypeProxy = new MsTypeProxy();
		}
		return this.MsTypeProxy;
	}
}

const factory = new ProxyFactory();
export default factory;
