/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import SpgModel from '@src/models/SpgModel.ts';

/**
 * Properties of a Provenance.
 */
export interface Properties {
	provenanceID: string;
	provenanceName: string;
	[x:string]: any
}

/**
 * Data model for a Provenance.
 */
export class Provenance extends SpgModel {
	public readonly provenanceID: string;
	public provenanceName: string;

	constructor(props: Properties) {
		super();
		if (!props.provenanceID.length) {
			throw Error('provenanceID cannot be empty.');
		}

		this.provenanceID = props.provenanceID;
		this.provenanceName = props.provenanceName || null;
	}

	toProperties(): Properties {
		return {
			provenanceID: this.provenanceID,
			provenanceName: this.provenanceName
		};
	}
}
