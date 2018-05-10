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
	[x: string]: any
}

/**
 * Data model for a Manuscript Type.
 */
export class MsType extends SpgModel implements Properties {
	public readonly msType: string;
	public msTypeName: string;

	public static MAX_LENGTHS = {
		msType: 20,
		msTypeName: 255
	};

	public constructor(props: Properties) {
		super();
		if (!props.msType) {
			throw Error('msType cannot be empty.');
		}
		this.msType = props.msType;
		this.msTypeName = props.msTypeName;
	}

	public toProperties(): Properties {
		return {
			msType: this.msType,
			msTypeName: this.msTypeName || ''
		};
	}

	/**
	 * Creates an empty MsType property set.
	 */
	public static createProperties(): Properties {
		return {
			msType: '',
			msTypeName: ''
		};
	}
}
