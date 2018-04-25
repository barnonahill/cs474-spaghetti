import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import InitPanel from '@src/components/section/SectionInitPanel.tsx';
import FilterPanel from '@src/components/section/SectionFilterPanel.tsx';
import TablePanel from '@src/components/section/SectionTablePanel.tsx';
// import EditPanel from '@src/components/section/SectionEditPanel.tsx';

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
import { MsType } from '@src/models/msType.ts';
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
		section?: sn.Section
	}
	temp: {
		library?: Library
		manuscript?: Manuscript
	}
	supports: {
		centuries?: Century[]
		cursuses?: Cursus[]
		srcComps?: SourceCompleteness[]
		provs?: Provenance[]
		notations?: Notation[]
		msTypes?: MsType[]
	}
}
export default class SectionApp extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.LOADER,
			loadMessage: 'Loading Supports...',
			primaries: {},
			supports: {},
			temp: {}
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
		this.loadMsTypes = this.loadMsTypes.bind(this);
		this.loadSupports = this.loadSupports.bind(this);

		this.loadSections = this.loadSections.bind(this);
		this.loadLibraries = this.loadLibraries.bind(this);
		this.loadManuscripts = this.loadManuscripts.bind(this);

		this.changePanel = this.changePanel.bind(this);
		this.setLoader = this.setLoader.bind(this);

		this.onInitSubmit = this.onInitSubmit.bind(this);
		this.onFilterSubmit = this.onFilterSubmit.bind(this);

		this.reloadSections = this.reloadSections.bind(this);
		this.openEntity = this.openEntity.bind(this);
		this.openEdit = this.openEdit.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);
		this.saveManuscript = this.saveManuscript.bind(this);
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

			// case Panel.EDIT:
			//  	return this.renderEdit();
			//
			// case Panel.ENTITY:
			// 	return this.renderEntity();

			case Panel.FILTER:
				return this.renderFilter();

			case Panel.TABLE:
				return this.renderTable();

			case Panel.LOADER:
				return this.renderLoader();
		}
	}

	renderInit() {
		return (<InitPanel
			onBack={this.props.onBack}
			onSubmit={this.onInitSubmit}
		/>);
	}

	renderEdit() {
		// return (<EditPanel
		// 	countries={this.props.countries}
		// 	section={this.state.primaries.section}
		// 	supports={this.state.supports as any}
		// 	onBack={() => this.changePanel(Panel.TABLE)}
		// 	onSubmit={this.saveManuscript}
		// />)
	}

	renderEntity() {}

	renderFilter() {
		return (<FilterPanel
			countries={this.props.countries}
			onBack={() => this.changePanel(Panel.INIT)}
			onSubmit={this.onFilterSubmit}
		/>);
	}

	renderTable() {
		return (<TablePanel
			library={this.state.primaries.library}
			manuscript={this.state.primaries.manuscript}
			sections={this.state.primaries.sections}
			onBack={() => this.changePanel(Panel.INIT)}
			onRefresh={this.reloadSections}
			onEdit={this.openEdit}
			onDelete={this.confirmDelete}
			onView={this.openEntity}

		/>);
	}

	renderLoader() {
		return <PageLoader inner={this.state.loadMessage} />;
	}

	loadCenturies(callback: (a:Century[]) => void) {
		this.setLoader('Loading Centuries...');
		proxyFactory.getSectionProxy().getCenturies((a, e?) => {
			if (e) {
				return alert(e);
			}
			callback(a);
		});
	}

	loadCursuses(callback: (a:Cursus[]) => void) {
		this.setLoader('Loading Cursuses...');
		proxyFactory.getSectionProxy().getCursuses((a, e?) => {
			if (e) {
				return alert(e);
			}
			return callback(a);
		});
	}

	loadSrcComps(callback: (a:SourceCompleteness[]) => void) {
		this.setLoader('Loading Source Completenesses...');
		proxyFactory.getSectionProxy().getSourceCompletenesses((a, e?) => {
			if (e) {
				return alert(e);
			}
			return callback(a);
		});
	}

	loadProvenances(callback: (a:Provenance[]) => void) {
		this.setLoader('Loading Provenances...');
		proxyFactory.getSectionProxy().getProvenances((a, e?) => {
			if (e) {
				return alert(e);
			}
			return callback(a);
		})
	}

	loadNotations(callback: (a:Notation[]) => void) {
		this.setLoader('Loading Notations...');
		proxyFactory.getSectionProxy().getNotations((a, e?) => {
			if (e) {
				return alert(e);
			}
			return callback(a);
		})
	}

	loadMsTypes(callback: (a:MsType[]) => void) {
		this.setLoader('Loading Manuscript Types...');
		proxyFactory.getManuscriptProxy().getMsTypes((a, e?) => {
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
							this.loadMsTypes((msTypes:MsType[]) =>
							{
								this.setState((s:S) => {
									Century.destroyArray(s.supports.centuries);
									Cursus.destroyArray(s.supports.cursuses);
									SourceCompleteness.destroyArray(s.supports.srcComps);
									Provenance.destroyArray(s.supports.provs);
									Notation.destroyArray(s.supports.notations);
									MsType.destroyArray(s.supports.msTypes);

									s.supports.centuries = centuries;
									s.supports.cursuses = cursuses;
									s.supports.srcComps = srcComps;
									s.supports.provs = provs;
									s.supports.notations = notations;
									s.supports.msTypes = msTypes;

									if (callback) return callback(s);
									else return s;
								});
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

	loadLibraries(countryID:string, callback: (a: Library[]) => void) {
		proxyFactory.getLibraryProxy().getLibraries(countryID, (a, e?) => {
			if (e) {
				return alert(e);
			}
			return callback(a);
		});
	}

	loadManuscripts(libSiglum: string, callback: (a: Manuscript[]) => void) {
		proxyFactory.getManuscriptProxy().getManuscripts(null, libSiglum, (a, e?) => {
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
				sn.Section.destroyArray(s.primaries.sections);
				s.primaries.library = null;
				s.primaries.manuscript = null;
				s.primaries.section = null;

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

	reloadSections() {
		this.setLoader('Loading Sections...');

		var libSiglum = (this.state.primaries.library
			? this.state.primaries.library.libSiglum
			: null);
		var msSiglum = (this.state.primaries.manuscript
			? this.state.primaries.manuscript.msSiglum
			: null);

		this.loadSections(libSiglum, msSiglum, ss => {
				this.setState((s:S) => {
					sn.Section.destroyArray(s.primaries.sections);
					s.primaries.section = null;

					s.primaries.sections = ss;
					s.panel = Panel.TABLE;
					return s;
				});
			});
	}

	openEntity(s:sn.Section) {}

	openEdit(stn:sn.Section) {
		this.setLoader('Loading Libraries...');
		var i = stn.libSiglum.indexOf('-');
		var countryID = stn.libSiglum.slice(0, i);

		this.loadLibraries(countryID, (ls:Library[]) => {
			this.setLoader('Loading Manuscripts...');

			this.loadManuscripts(stn.libSiglum, (ms: Manuscript[]) => {
				this.setState((s:S) => {
					s.temp.library = ls.find(l => stn.libSiglum === l.libSiglum);
					s.temp.manuscript = ms.find(m => stn.libSiglum === m.libSiglum
						&& stn.msSiglum === m.msSiglum);
				});
			});
		});

		this.setState((s:S) => {
			s.primaries.section = stn;
			s.panel = Panel.EDIT;
			return s;
		});
	}

	confirmDelete(section:sn.Section) {
		var del = confirm('Delete ' + section.libSiglum + ' ' + section.msSiglum + ' ' + section.sectionID +
			'? This will delete all children of this section as well!');

		if (del) {
			proxyFactory.getSectionProxy().deleteSection(section.libSiglum, section.msSiglum, section.sectionID,
				(success, e?) =>
			{
				if (e) {
					return alert(e);
				}
				if (!success) {
					return alert('Failed to delete section.');
				}

				this.setState((s:S) => {
					var i = s.primaries.sections.findIndex(sec => {
						return section.libSiglum === sec.libSiglum && section.msSiglum === sec.msSiglum &&
							section.sectionID === sec.sectionID;
					});
					s.primaries.sections[i].destroy();
					s.primaries.sections.splice(i, 1);
					return s;
				});
			})
		}
	}

	saveManuscript(p:sn.Properties, isNew: boolean) {
		this.setLoader('Saving Section...');
		if (isNew) {
			proxyFactory.getSectionProxy().createSection(p, (stn, e?) => {
				if (e) {
					return alert(e);
				}

				this.setState((s:S) => {
					s.primaries.sections.push(stn);
					s.panel = Panel.TABLE;
					return s;
				});
			});
		}
		else {
			proxyFactory.getSectionProxy().updateSection(p, (stn, e?) => {
				if (e) {
					return alert(e);
				}

				this.setState((s:S) => {
					var i = s.primaries.sections.findIndex(o => {
						return p.libSiglum === o.libSiglum && p.sectionID === o.sectionID
							&& p.msSiglum === o.msSiglum;
					});

					s.primaries.sections[i].destroy();
					s.primaries.sections[i] = stn;
					s.panel = Panel.TABLE;
					return s;
				});
			});
		}
	}
}
