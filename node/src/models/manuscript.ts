/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import { Library } from '@src/models/library';
import { MsType } from '@src/models/msType';
import SpgModel from '@src/models/SpgModel';
import SpgProxy from '@src/proxies/SpgProxy'
import proxyFactory from '@src/proxies/ProxyFactory';

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

	private library: Library;
	private manuscriptType: MsType;

	constructor(props: Properties) {
		super();
		for (let k in props) {
			if (k === 'libSiglum') {
				if (!(props[k] && props[k].length)) {
					throw Error('libSiglum cannot be empty');
				}
				this.libSiglum = props[k];
			}
			else if (k === 'msSiglum') {
				if (!(props[k] && props[k].length)) {
					throw Error('msSiglum cannot be empty');
				}
				this.msSiglum = props[k];
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

	getLibrary(callback: (library: Library, err?: string) => void): void {
		if (!this.library) {
			proxyFactory.getLibraryProxy().getLibrary(this.libSiglum, (library: Library, err?: string) => {
				if (err) {
					SpgProxy.callbackError(callback, err);
				}

				this.library = library;
				callback(library, null);
			});
		}
		else {
			callback(this.library, null);
		}
	}

	getMsType(callback: (msType: MsType, err?: string) => void): void {
		if (!this.manuscriptType) {
			proxyFactory.getMsTypeProxy().getMsType(this.msType, (msType: MsType, err?: string) => {
				if (err) {
					SpgProxy.callbackError(callback, err);
				}
				else {
					this.manuscriptType = msType;
					callback(msType, null);
				}
			});
		}
		else {
			callback(this.manuscriptType, null);
		}
	}

	destroy() {
		if (this.library) {
			this.library.destroy();
		}
		if (this.manuscriptType) {
			this.manuscriptType.destroy();
		}
		super.destroy();
	}
}
