/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import { Country } from '@src/models/country';
import SpgModel from '@src/models/SpgModel.ts';
import SpgProxy from '@src/proxies/SpgProxy.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

/**
 * Properties of a Library.
 */
export interface Properties {
	libSiglum: string;
	city?: string;
	library?: string;
	address1?: string;
	address2?: string;
	postCode?: string;
	countryID?: string;
	// Index signature to allow iteration over properties in Typescript
	[x: string]: any;
}

/**
 * Data model for a Library.
 */
export class Library extends SpgModel implements Properties {
	public readonly libSiglum: string;
	public city: string;
	public library: string;
	public address1: string;
	public address2: string;
	public postCode: string;
	public countryID: string;
	// Index signature to allow iteration over properties in Typescript
	[x: string]: any;

	private country: Country;

	constructor(props: Properties) {
		super();

		for (let k in props) {
			if (k === 'libSiglum') {
				if (!props[k].length) {
					throw Error('libSiglum cannot be empty.');
				}

				this.libSiglum = props[k];
			}
			else {
				this[k] = props[k] || null;
			}
		}
	}

	/**
	 * Returns the property map of this Library.
	 */
	toProperties(): Properties {
		return {
			libSiglum: this.libSiglum,
			city: this.city,
			library: this.library,
			address1: this.address1,
			address2: this.address2,
			postCode: this.postCode,
			countryID: this.countryID
		};
	}

	getCountry(callback: (country: Country, err?: string) => void): void {
		if (!this.country) {
			proxyFactory.getLibraryProxy().getCountry(this.countryID, (country: Country, err?: string) => {
				if (err) {
					SpgProxy.callbackError(callback, err);
				}
				else {
					this.country = country;
					callback(country, null);
				}
			});
		}
		else {
			callback(this.country, null);
		}
	}

	/**
	 * Returns a JSON representation of this Library.
	 */
	toString(): string {
		return JSON.stringify(this.toProperties());
	}
}
