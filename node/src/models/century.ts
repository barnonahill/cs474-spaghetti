/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import SpgModel from '@src/models/SpgModel.ts';

/**
 * Properties of a Century.
 */
export interface Properties {
	centuryID: string;
	centuryName: string;
}

/**
 * Data model for a Century.
 */
export class Century extends SpgModel {
	public readonly centuryID: string;
	public centuryName: string;

	constructor(props: Properties) {
		super();
		this.centuryID = props.centuryID;
		this.centuryName = props.centuryName || null;
	}

	toProperties(): Properties {
		return {
			centuryID: this.centuryID,
			centuryName: this.centuryName
		};
	}
}
