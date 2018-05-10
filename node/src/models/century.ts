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
	[x: string]: any
}

/**
 * Data model for a Century.
 */
export class Century extends SpgModel {
	public readonly centuryID: string;
	public centuryName: string;

	public static MAX_LENGTHS = {
		centuryID: 20,
		centuryName: 255
	};

	public constructor(props: Properties) {
		super();
		if (!props.centuryID) {
			throw Error('centuryID cannot be empty');
		}
		this.centuryID = props.centuryID;
		this.centuryName = props.centuryName || null;
	}

	public toProperties(): Properties {
		return {
			centuryID: this.centuryID,
			centuryName: this.centuryName || ''
		};
	}

	/**
	 * Creates an empty Century property set.
	 */
	public static createProperties(): Properties {
		return {
			centuryID: '',
			centuryName: ''
		};
	}
}
