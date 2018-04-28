/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import SpgModel from '@src/models/SpgModel.ts';

/**
 * Properties of a cursus.
 */
export interface Properties {
	cursusID: string;
	cursusName: string;
	[x: string]: any
}

/**
 * Data model for a cursus.
 */
export class Cursus extends SpgModel {
	public readonly cursusID: string;
	public cursusName: string;

	constructor(props: Properties) {
		super();
		if (!props.cursusID.length) {
			throw Error('cursusID cannot be empty.');
		}

		this.cursusID = props.cursusID;
		this.cursusName = props.cursusName || null;
	}

	toProperties(): Properties {
		return {
			cursusID: this.cursusID,
			cursusName: this.cursusName
		};
	}
}
