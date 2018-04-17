/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import SpgModel from '@src/models/SpgModel.ts';

/**
 * Properties of a Feast.
 */
export interface Properties {
	feastID: string;
	feastCode?: string;
	feastName?: string;
	feastDescription?: string; // CLOB
	feastDate?: string;
	feastDay?: string;
	feastMonth?: string;
	feastNotes?: string;
	[x: string]: any;
}

/**
 * Data model for a feast.
 */
export class Feast extends SpgModel implements Properties {
	public readonly feastID: string;
	public feastCode: string;
	public feastName: string;
	public feastDescription: string;
	public feastDate: string;
	public feastDay: string;
	public feastMonth: string;
	public feastNotes: string;
	[x: string]: any;

	constructor(props: Properties) {
		super();
		for (let k in props) {
			if (k === 'feastID') {
				if (!props[k].length) {
					throw Error('feastID cannot be empty.');
				}
				this.feastID = props[k];
			}
			else {
				this[k] = props[k] || null;
			}
		}
	}

	toProperties(): Properties {
		return {
			feastID: this.feastID,
			feastCode: this.feastCode,
			feastName: this.feastName,
			feastDescription: this.feastDescription,
			feastDate: this.feastDate,
			feastDay: this.feastDay,
			feastMonth: this.feastMonth,
			feastNotes: this.feastNotes
		};
	}
}
