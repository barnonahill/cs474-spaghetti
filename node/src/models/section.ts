/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import { Library } from '@src/models/library';
import { Manuscript } from '@src/models/manuscript';
//import { Library } from '@src/models/Library';
import { Notation } from '@src/models/notation';
import { Century } from '@src/models/century';
import { Cursus } from '@src/models/cursus';
import { Provenance } from '@src/models/provenance';
import { SourceCompleteness } from '@src/models/sourceCompleteness';
import SpgModel from '@src/models/SpgModel';
import SpgProxy from '@src/proxies/SpgProxy';
import proxyFactory from '@src/proxies/ProxyFactory';

/**
 * Properties of a Section.
 */
export interface Properties {
	libSiglum: string;
	msSiglum: string;
	sectionID: number;
	sectionType: string;
	liturgicalOccasion: string; // CLOB
	notationID: string; // FK
	numGatherings: number;
	numColumns: number;
	linesPerColumn: number;
	scribe: string;
	date: string;
	centuryID: string; // FK
	cursusID: string; // FK
	provenanceID: string; // FK
	provenanceDetail: string;
	commissioner: string;
	inscription: string; // CLOB
	colophon: string; // CLOB
	sourceCompletenessID: string; // FK
	// Index signature to allow iteration over properties in Typescript
	[x: string]: any;
}

/**
 * Data model of a Section.
 */
export class Section extends SpgModel implements Properties {
	public libSiglum: string;
	public msSiglum: string;
	public readonly sectionID: number;
	public sectionType: string;
	public liturgicalOccasion: string;
	public notationID: string;
	public numGatherings: number;
	public numColumns: number;
	public linesPerColumn: number;
	public scribe: string;
	public date: string;
	public centuryID: string;
	public cursusID: string;
	public provenanceID: string;
	public provenanceDetail: string;
	public commissioner: string;
	public inscription: string;
	public colophon: string;
	public sourceCompletenessID: string;
	[x: string]: any;

	private library: Library;
	private manuscript: Manuscript;
	//private sectionType: SectionType;
	private notation: Notation;
	private century: Century;
	private cursus: Cursus;
	private provenance: Provenance;
	private sourceCompleteness: SourceCompleteness;

	constructor(props: Properties) {
		super();
		for (let k in props) {
			if (k === 'libSiglum') {
				if (!(props && props[k].length)) {
					throw Error('libSiglum cannot be empty.');
				}
				this.libSiglum = props[k];
			}
			else if (k === 'msSiglum') {
				if (!(props && props[k].length)) {
					throw Error('msSiglum cannot be empty.');
				}
				this.msSiglum = props[k];
			}
			// else if (k === 'sectionType')
			else if (k === 'notationID') {
				if (!(props && props[k].length)) {
					throw Error('notationID cannot be empty.');
				}
				this.notationID = props[k];
			}
			else if (k === 'centuryID') {
				if (!(props && props[k].length)) {
					throw Error('centuryID cannot be empty.');
				}
				this.centuryID = props[k];
			}
			else if (k === 'cursusID') {
				if (!(props && props[k].length)) {
					throw Error('cursusID cannot be empty.');
				}
				this.cursusID = props[k];
			}
			else if (k === 'provenanceID') {
				if (!(props && props[k].length)) {
					throw Error('provenanceID cannot be empty.');
				}
				this.provenanceID = props[k];
			}
			else if (k === 'sourceCompletenessID') {
				if (!(props && props[k].length)) {
					throw Error('sourceCompletenessID cannot be empty.');
				}
				this.sourceCompletenessID = props[k];
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
			sectionID: this.sectionID,
			sectionType: this.sectionType,
			liturgicalOccasion: this.liturgicalOccasion,
			notationID: this.notationID,
			numGatherings: this.numGatherings,
			numColumns: this.numColumns,
			linesPerColumn: this.linesPerColumn,
			scribe: this.scribe,
			date: this.date,
			centuryID: this.centuryID,
			cursusID: this.cursusID,
			provenanceID: this.provenanceID,
			provenanceDetail: this.provenanceDetail,
			commissioner: this.commissioner,
			inscription: this.inscription,
			colophon: this.colophon,
			sourceCompletenessID: this.sourceCompletenessID
		};
	}

	getLibrary(callback: (library: Library, err?: string) => void): void {
		if (!this.library) {
			proxyFactory.getLibraryProxy().getLibrary(this.libSiglum, (library: Library, err?: string) => {
				if (err) {
					SpgProxy.callbackError(callback, err);
				}
				else {
					this.library = library;
					callback(library, null);
				}
			});
		}
		else {
			callback(this.library, null);
		}
	}

	getManuscript(callback: (ms: Manuscript, err?: string) => void): void {
		if (!this.manuscript) {
			// TODO get manuscript
		}
		else {
			callback(this.manuscript, null);
		}
	}

	// getSectionType

	getNotation(callback: (notation: Notation, err?: string) => void): void {
		if (!this.notation) {
			// TODO get notation
		}
		else {
			callback(this.notation, null);
		}
	}

	getCentury(callback: (century: Century, err?: string) => void): void {
		if (!this.century) {
			// TODO get century
		}
		else {
			callback(this.century, null);
		}
	}

	getCursus(callback: (cursus: Cursus, err?: string) => void): void {
		if (!this.cursus) {
			// TODO get cursus
		}
		else {
			callback(this.cursus, null);
		}
	}

	getProvenance(callback: (provenance: Provenance, err?: string) => void): void {
		if (!this.provenance) {
			// TODO get provenance
		}
		else {
			callback(this.provenance, null);
		}
	}

	getSourceCompleteness(callback: (sc: SourceCompleteness, err?: string) => void): void {
		if (!this.sourceCompleteness) {
			// TODO get sourceCompleteness
		}
		else {
			callback(this.sourceCompleteness, null);
		}
	}
}
