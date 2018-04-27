/**
 * @author Paul Barnhill
 * @version 2018-04-16
 */
import { Library } from '@src/models/library';
import { Manuscript } from '@src/models/manuscript.ts';
//import { Library } from '@src/models/Library';
import { Notation } from '@src/models/notation';
import { Century } from '@src/models/century';
import { Cursus } from '@src/models/cursus';
import { Provenance } from '@src/models/provenance';
import { SourceCompleteness } from '@src/models/sourceCompleteness';
import SpgModel from '@src/models/SpgModel.ts';
import SpgProxy from '@src/proxies/SpgProxy.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

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
	public readonly msSiglum: string;
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

	constructor(props: Properties) {
		super();
		for (let k in props) {
			if (k === 'libSiglum' || k === 'msSiglum' || k === 'secionID')
			{
				if (!(props && props[k].length)) {
					throw Error(k + ' cannot be empty.');
				}
				this[k] = props[k];
			}
			else {
				this[k] = props[k];
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
}
