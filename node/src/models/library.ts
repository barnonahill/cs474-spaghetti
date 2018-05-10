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
	countryID: string;
	city: string;
	library: string;
	address1: string;
	address2: string;
	postCode: string;
	// Index signature to allow iteration over properties in Typescript
	[x: string]: any;
}

/**
 * Data model for a Library.
 */
export class Library extends SpgModel implements Properties {
	public readonly libSiglum: string;
	public countryID: string;
	public city: string;
	public library: string;
	public address1: string;
	public address2: string;
	public postCode: string;

	public static MAX_LENGTHS = {
		libSiglum: 10,
		countryID: 20,
		city: 255,
		library: 255,
		address1: 255,
		address2: 255,
		postCode: 12,
	};

	// Index signature to allow iteration over properties in Typescript
	[x: string]: any;

	public constructor(props: Properties) {
		super();

		for (let k in props) {
			if (k === 'libSiglum' || k === 'countryID' || k === 'city' || k === 'library') {
				if (!props[k]) {
					throw Error(k + ' cannot be empty');
				}
			}
			this[k] = props[k];
		}
	}

	/**
	 * Returns a copy of the property map of this Library.
	 */
	public toProperties(): Properties {
		return {
			libSiglum: this.libSiglum,
			countryID: this.countryID,
			city: this.city,
			library: this.library,
			address1: this.address1 || '',
			address2: this.address2 || '',
			postCode: this.postCode || '',
		};
	}

	/**
	 * Creates an empty Library property map.
	 * @return
	 */
	public static createProperties(): Properties {
		return {
			libSiglum: '',
			countryID: '',
			city: '',
			library: '',
			address1: '',
			address2: '',
			postCode: ''
		};
	}
}
