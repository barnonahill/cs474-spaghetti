/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import { Library } from '@src/models/library';
import { MsType } from '@src/models/msType.ts';
import SpgModel from '@src/models/SpgModel.ts';
import SpgProxy from '@src/proxies/SpgProxy.ts'
import proxyFactory from '@src/proxies/ProxyFactory.ts';

/**
 * Properties of a Manuscript.
 */
export interface Properties {
	libSiglum: string;
	msSiglum: string;
	msType: string;
	dimensions: string;
	leaves: number;
	foliated: boolean;
	vellum: boolean;
	binding: string;
	sourceNotes: string; // CLOB
	summary: string; // CLOB
	bibliography: string; // CLOB
	[x: string]: any;
}

/**
 * Data model for a Manuscript.
 */
export class Manuscript extends SpgModel implements Properties {
	public libSiglum: string;
	public readonly msSiglum: string;
	public msType: string;
	public dimensions: string;
	public leaves: number;
	public foliated: boolean;
	public vellum: boolean;
	public binding: string;
	public sourceNotes: string;
	public summary: string;
	public bibliography: string;
	[x: string]: any;

	constructor(props: Properties) {
		super();
		for (let k in props) {
			if (k === 'libSiglum' || k === 'msSiglum') {
				if (props[k] === null) {
					throw Error(k + ' cannot be empty');
				}
				this[k] = props[k];
			}
			else {
				this[k] = props[k] || null;
			}
		}
	}

	toProperties(): Properties {
		return {
			libSiglum: this.libSiglum,
			msSiglum: this.msSiglum,
			msType: this.msType,
			dimensions: this.dimensions,
			leaves: this.leaves,
			foliated: this.foliated,
			vellum: this.velluim,
			binding: this.binding,
			sourceNotes: this.sourceNotes,
			summary: this.summary,
			bibliography: this.bibliography
		};
	}
}
