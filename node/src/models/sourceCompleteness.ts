/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import SpgModel from '@src/models/SpgModel.ts';

/**
 * Properties of a SourceCompleteness.
 */
export interface Properties {
	sourceCompletenessID: string;
	sourceCompletenessName: string;
	[x:string]: any
}

/**
 * Data model for a SourceCompleteness.
 */
export class SourceCompleteness extends SpgModel {
	public readonly sourceCompletenessID: string;
	public sourceCompletenessName: string;

	constructor(props: Properties) {
		super();
		if (!props.sourceCompletenessID.length) {
			throw Error('sourceCompletenessID cannot be empty.');
		}

		this.sourceCompletenessID = props.sourceCompletenessID;
		this.sourceCompletenessName = props.sourceCompletenessName || null;
	}

	toProperties(): Properties {
		return {
			sourceCompletenessID: this.sourceCompletenessID,
			sourceCompletenessName: this.sourceCompletenessName
		};
	}
}
