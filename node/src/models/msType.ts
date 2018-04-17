/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import SpgModel from '@src/models/SpgModel.ts';

/**
 * Properties of a Manuscript Type.
 */
export interface Properties {
	msType: string;
	msTypeName: string;
}

/**
 * Data model for a Manuscript Type.
 */
export class MsType extends SpgModel implements Properties {
	public readonly msType: string;
	public msTypeName: string;

	constructor(props: Properties) {
		super();
		if (!props.msType.length) {
			throw Error('msType cannot be empty.');
		}
		if (!props.msTypeName.length) {
			throw Error('msTypeName cannot be empty.');
		}
		this.msType = props.msType;
		this.msTypeName = props.msTypeName;
	}

	toProperties(): Properties {
		return {
			msType: this.msType,
			msTypeName: this.msTypeName
		};
	}
}
