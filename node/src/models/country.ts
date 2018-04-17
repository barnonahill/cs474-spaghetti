/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import SpgModel from '@src/models/SpgModel';

/**
 * Properties of a country.
 */
export interface Properties {
	countryID: string;
	country: string;
}

/**
 * Data model for a country.
 */
export class Country extends SpgModel {
	public readonly countryID: string;
	public readonly country: string;

	constructor(props: Properties) {
		super();
		if (!props.countryID.length) {
			throw Error('countryID cannot be empty.');
		}
		if (!props.country.length) {
			throw Error('country cannot be empty.');
		}

		this.countryID = props.countryID;
		this.country = props.country;
	}

	toProperties(): Properties {
		return {
			countryID: this.countryID,
			country: this.country
		};
	}
}
