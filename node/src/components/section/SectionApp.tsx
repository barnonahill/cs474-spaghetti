import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import InitPanel from '@src/components/section/SectionInitPanel.tsx';
import FilterPanel from '@src/components/section/SectionFilterPanel.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import { Manuscript } from '@src/models/manuscript.ts';
import * as sn from '@src/models/section.ts';
// Support Entities
import { Century } from '@src/models/century.ts';
import { Cursus } from '@src/models/cursus.ts';
import { SourceCompleteness } from '@src/models/sourceCompleteness.ts';
import { Provenance } from '@src/models/provenance.ts';
import { Notation } from '@src/models/notation.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

export enum Panel {
	INIT = 0,
	EDIT = 1,
	ENTITY = 2,
	TABLE = 3,
	LOADER = 4,
	FILTER = 5,
	CENTURY = 6,
	CURSUS = 7,
	SRC_COMP = 8,
	PROVENANCE = 9,
	NOTATION = 10
}

interface P {
	countries: Country[]
	onBack: () => void
	// Opened from ManuscriptEntityPanel
	panel?: Panel
	country?: Country
	library?: Library
	manuscript?: Manuscript
}
interface S {
	panel: Panel
	loadMessage?: string
	primaries: {
		libraries?: Library[]
		manuscripts?: Manuscript[]
		library?: Library
		manuscript?: Manuscript
		sections?: sn.Section[]
	}
	supports: {
		centuries?: Century[]
		cursuses?: Cursus[]
		srcComps?: SourceCompleteness[]
		provs?: Provenance[]
		notations?: Notation[]
	}
}
export default class SectionApp extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.LOADER,
			loadMessage: 'Loading Supports...',
			primaries: {},
			supports: {}
		};

		this.renderInit = this.renderInit.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderEntity = this.renderEntity.bind(this);
		this.renderTable = this.renderTable.bind(this);
		this.renderLoader = this.renderLoader.bind(this);

		this.loadCenturies = this.loadCenturies.bind(this);
		this.loadCursuses = this.loadCursuses.bind(this);
		this.loadSrcComps = this.loadSrcComps.bind(this);
		this.loadProvenances = this.loadProvenances.bind(this);
		this.loadNotations = this.loadNotations.bind(this);
		this.loadSupports = this.loadSupports.bind(this);

		this.loadSections = this.loadSections.bind(this);

		this.changePanel = this.changePanel.bind(this);
		this.setLoader = this.setLoader.bind(this);

		this.onInitSubmit = this.onInitSubmit.bind(this);
		this.onFilterSubmit = this.onFilterSubmit.bind(this);
	}

	componentDidMount() {
		this.loadSupports((s:S) => {
			s.panel = Panel.INIT;
			return s;
		});
	}

	render() {
		switch (this.state.panel) {
			default:
			case Panel.INIT:
				return this.renderInit();
			//
			// case Panel.EDIT:
			//  	return this.renderEdit();
			//
			// case Panel.ENTITY:
			// 	return this.renderEntity();

			case Panel.FILTER:
				return this.renderFilter();
			//
			// case Panel.TABLE:
			// 	return this.renderTable();

			case Panel.LOADER:
				return this.renderLoader();
		}
	}

	renderInit() {
		return (<InitPanel
			onBack={this.props.onBack}
			onSubmit={(p) => this.setState((s:S) => {
				s.panel = p;
				return s;
			})}
		/>);
	}

	renderEdit() {}

	renderEntity() {}

	renderFilter() {
		return (<FilterPanel
			countries={this.props.countries}
			onBack={() => this.changePanel(Panel.INIT)}
			onSubmit={this.onFilterSubmit}
		/>);
	}

	renderTable() {}

	renderLoader() {
		return <PageLoader inner={this.state.loadMessage} />;
	}

	loadCenturies(callback: (a:Century[]) => void) {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadMessage = 'Loading Centuries...';
			return s;
		});

		proxyFactory.getSectionProxy().getCenturies((a, e?) => {
			if (e) {
				return alert(e);
			}
			callback(a);
		});
	}

	loadCursuses(callback: (a:Cursus[]) => void) {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadMessage = 'Loading Cursuses...';
			return s;
		});

		proxyFactory.getSectionProxy().getCursuses((a, e?) => {
			if (e) {
				return alert(e);
			}
			return callback(a);
		});
	}

	loadSrcComps(callback: (a:SourceCompleteness[]) => void) {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadMessage = 'Loading Source Completenesses...';
			return s;
		});

		proxyFactory.getSectionProxy().getSourceCompletenesses((a, e?) => {
			if (e) {
				return alert(e);
			}
			return callback(a);
		});
	}

	loadProvenances(callback: (a:Provenance[]) => void) {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadMessage = 'Loading Provenances...';
			return s;
		});

		proxyFactory.getSectionProxy().getProvenances((a, e?) => {
			if (e) {
				return alert(e);
			}
			return callback(a);
		})
	}

	loadNotations(callback: (a:Notation[]) => void) {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadMessage = 'Loading Notations...';
			return s;
		});
		proxyFactory.getSectionProxy().getNotations((a, e?) => {
			if (e) {
				return alert(e);
			}
			return callback(a);
		})
	}

	loadSupports(callback?: (s:S) => S) {
		this.loadCenturies((centuries:Century[]) =>
		{
			this.loadCursuses((cursuses:Cursus[]) =>
			{
				this.loadSrcComps((srcComps:SourceCompleteness[]) =>
				{
					this.loadProvenances((provs:Provenance[]) =>
					{
						this.loadNotations((notations:Notation[]) =>
						{
							this.setState((s:S) => {
								Century.destroyArray(s.supports.centuries);
								Cursus.destroyArray(s.supports.cursuses);
								SourceCompleteness.destroyArray(s.supports.srcComps);
								Provenance.destroyArray(s.supports.provs);
								Notation.destroyArray(s.supports.notations);

								s.supports.centuries = centuries;
								s.supports.cursuses = cursuses;
								s.supports.srcComps = srcComps;
								s.supports.provs = provs;
								s.supports.notations = notations;

								if (callback) return callback(s);
								else return s;
							});
						});
					});
				});
			});
		});
	}

	loadSections(libSiglum:string, msSiglum:string, callback:(a: sn.Section[]) => void) {
		proxyFactory.getSectionProxy().getSections(libSiglum, msSiglum, (a, e?) => {
			if (e) {
				return alert(e);
			}
			return callback(a);
		});
	}

	changePanel(p:Panel, callback?: (s:S) => S) {
		this.setState((s:S) => {
			s.panel = p;

			if (callback) return callback(s);
			else return s;
		})
	}

	setLoader(msg:string) {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadMessage = msg;
			return s;
		});
	}

	onInitSubmit(p:Panel) {
		if (p === Panel.TABLE) {
			this.setLoader('Loading Sections...');
			this.loadSections(null, null, ss => {
				this.setState((s:S) => {
					s.primaries.sections = ss;
					s.panel = p;
					return s;
				});
			});
		}
		else {
			this.changePanel(p);
		}
	}

	onFilterSubmit(c:Country, l:Library, m:Manuscript, ls:Library[], ms:Manuscript[]) {
		this.setLoader('Loading Manuscripts for ' + l.libSiglum + ' ' + m.msSiglum + '...');

		this.loadSections(l.libSiglum, m.msSiglum, ss => {
			this.setState((s:S) => {
				Library.destroyArray(s.primaries.libraries);
				Manuscript.destroyArray(s.primaries.manuscripts);
				s.primaries.library = null;
				s.primaries.manuscript = null;

				s.primaries.libraries = ls;
				s.primaries.manuscripts = ms;
				s.primaries.library = l;
				s.primaries.manuscript = m;
				s.primaries.sections = ss;

				s.panel = Panel.TABLE;
				return s;
			});
		});
	}
}
