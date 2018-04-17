/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import SpgModel from '@src/models/SpgModel';

/**
 * Properties of a genre.
 */
export interface Properties {
	genreID: string;
	genreDescription: string;
}

/**
 * Data model for a genre.
 */
export class Genre extends SpgModel implements Properties {
	public readonly genreID: string;
	public genreDescription: string;

	constructor(props: Properties) {
		super();
		if (!props.genreID.length) {
			throw Error('genreID cannot be empty');
		}
		this.genreID = props.genreID;
		this.genreDescription = props.genreDescription || null;
	}

	toProperties(): Properties {
		return {
			genreID: this.genreID,
			genreDescription: this.genreDescription
		};
	}
}
