/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import SpgModel from '@src/models/SpgModel';

/**
 * Properties of a Notation.
 */
export interface Properties {
	notationID: string;
	notationName: string;
}

/**
 * Data model for a Notation.
 */
export class Notation extends SpgModel {
	public readonly notationID: string;
	public notationName: string;

	constructor(props: Properties) {
		super();
		if (!props.notationID.length) {
			throw Error('notationID cannot be empty.');
		}

		this.notationID = props.notationID;
		this.notationName = props.notationName || null;
	}

	toProperties(): Properties {
		return {
			notationID: this.notationID,
			notationName: this.notationName
		};
	}
}
