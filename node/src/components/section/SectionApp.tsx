import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import InitPanel from '@src/components/section/SectionInitPanel.tsx';
import FilterPanel from '@src/components/section/SectionFilterPanel.tsx';
import TablePanel from '@src/components/section/SectionTablePanel.tsx';
import EditPanel from '@src/components/section/SectionEditPanel.tsx';
import EntityPanel from '@src/components/section/SectionEntityPanel.tsx';
import StateUtils from '@src/components/StateUtilities.ts'

import CenturyApp from '@src/components/century/CenturyApp.tsx';
import CursusApp from '@src/components/cursus/CursusApp.tsx';
import SourceCompletenessApp from '@src/components/sourceCompleteness/SourceCompletenessApp.tsx';
import ProvenanceApp from '@src/components/provenance/ProvenanceApp.tsx';
import NotationApp from '@src/components/notation/NotationApp.tsx';
import MsTypeApp from '@src/components/msType/MsTypeApp.tsx';

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
	NOTATION = 10,
	MS_TYPE = 11
}

interface P {
	countries: Country[]
	onBack: () => void

	// If opened from ManuscriptEntityPanel:
	sideloads?: {
		country: Country
		library: Library
		manuscript: Manuscript
		libraries?: Library[]
		manuscripts?: Manuscript[]
		msTypes: MsType[]
	}
}
interface S {
	panel: Panel
	loadMessage?: string

	// Main entities
	primaries: {
		// If sections are filtered:
		country?: Country
		library?: Library
		manuscript?: Manuscript
		libraries?: Library[]
		manuscripts?: Manuscript[]

		section?: sn.Section
		[x:string]: any

		// Always provided
		sections?: sn.Section[]
	}

	// If we're rendering an existing Section from an unfiltered load, temps are set before the panel
	// is mounted and removed when it unmounts.
	temps?: {
		country?: Country
		library?: Library
		manuscript?: Manuscript
		[x: string]: any
	}

	// Support entities, these are loaded after SectionApp mounts.
	supports: {
		centuries?: Century[]
		cursuses?: Cursus[]
		srcComps?: SourceCompleteness[]
		provs?: Provenance[]
		notations?: Notation[]
		msTypes?: MsType[]
		[x: string]: any
	}
}
export default class SectionApp extends React.Component<P,S> {
	public readonly state: S;
	public readonly props: P;

	private setPanel: (panel: Panel, callback?: (s:S) => S, state?:S) => void
	private setLoader: (loadMessage: string, callback?: (s:S) => S, state?:S) => void

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.LOADER,
			loadMessage: 'Loading Supports...',
			primaries: {},
			supports: {},
			temps: {}
		};

		// JSX Element Getter bindings
		this.renderInit = this.renderInit.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderEntity = this.renderEntity.bind(this);
		this.renderTable = this.renderTable.bind(this);
		this.renderLoader = this.renderLoader.bind(this);

		this.renderCenturyApp = this.renderCenturyApp.bind(this);
		this.renderCursusApp = this.renderCursusApp.bind(this);
		this.renderSourceCompletenessApp = this.renderSourceCompletenessApp.bind(this);
		this.renderProvenanceApp = this.renderProvenanceApp.bind(this);
		this.renderNotationApp = this.renderNotationApp.bind(this);
		this.renderMsTypeApp = this.renderMsTypeApp.bind(this);

		// Support load bindings
		this.loadCenturies = this.loadCenturies.bind(this);
		this.loadCursuses = this.loadCursuses.bind(this);
		this.loadSrcComps = this.loadSrcComps.bind(this);
		this.loadProvenances = this.loadProvenances.bind(this);
		this.loadNotations = this.loadNotations.bind(this);
		this.loadMsTypes = this.loadMsTypes.bind(this);
		this.loadSupports = this.loadSupports.bind(this);

		// Primary load bindings
		this.loadLibraries = this.loadLibraries.bind(this);
		this.loadManuscripts = this.loadManuscripts.bind(this);
		this.loadSections = this.loadSections.bind(this);
		this.reloadSections = this.reloadSections.bind(this);

		// Temp load bindings
		this.loadLibrary = this.loadLibrary.bind(this);
		this.loadManuscript = this.loadManuscript.bind(this);

		// State setter util bindings
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);

		// Panel open bindings
		this.loadTemps = this.loadTemps.bind(this);
		this.destroyTemps = this.destroyTemps.bind(this);
		this.openEntity = this.openEntity.bind(this);
		this.openEdit = this.openEdit.bind(this);
		this.getEditPrimaries = this.getEditPrimaries.bind(this);

		// Panel submit bindings
		this.onInitSubmit = this.onInitSubmit.bind(this);
		this.onFilterSubmit = this.onFilterSubmit.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// Entity manipulation binding
		this.saveSection = this.saveSection.bind(this);
	}

	componentDidMount() {
		if (this.props.sideloads) {
			// Sideload from ManuscriptEntityPanel
			var side = this.props.sideloads;
			var finishLoad = (libraries:Library[], sections:sn.Section[]) => {
				this.loadSupports(s => {
					s.primaries.libraries = libraries;
					s.primaries.manuscripts = side.manuscripts;
					s.primaries.sections = sections;

					s.primaries.country = side.country
					s.primaries.library = side.library;
					s.primaries.manuscript = side.manuscript;

					this.setPanel(Panel.TABLE, null, s);
					return s;
				});
			}

			// Make sure we have everything for a filtered table view
			this.setLoader('Loading Sections...');
			this.loadSections(side.manuscript.libSiglum, side.manuscript.msSiglum, sections => {
				if (!side.libraries) {
					this.setLoader('Loading Libraries...');
					this.loadLibraries(side.country.countryID, libraries => {
						finishLoad(libraries, sections);
					});
				}
				else {
					finishLoad(side.libraries, sections);
				}
			});
		}

		else {
			// Normal load
			this.loadSupports((s:S) => {
				this.setPanel(Panel.INIT, null, s);
				return s;
			});
		}
		// Load all support entities upon mount
	}

	/**
	 * Destroys all the Cantus data that was loaded in the Section App, before it's unmounted.
	 */
	componentWillUnmount() {
		var k:string;
		// Make sure there's no memory leakage.
		// TODO
		var pri = this.state.primaries;
		var sup = this.state.supports;
		var side = this.props.sideloads;
		if (side) {
			if (!side.libraries) {
				Country.destroyArray(pri.libraries);
			}
			for (k in sup) {
				if (sup[k] && k !== 'msTypes') Country.destroyArray(sup[k]);
			}
		}

		else {
			for (k in pri) {
				if (pri[k] && pri[k].constructor === Array) {
					if (k !== 'countries') Country.destroyArray(pri[k]);
				}
				else if (pri[k] && k !== 'country') {
					pri[k].destroy();
				}
			}

			for (k in sup) {
				if (sup[k]) Country.destroyArray(sup[k]);
			}
		}

		if (this.state.temps) {
			for (k in this.state.temps) {
				if (this.state.temps[k] && k !== 'country') this.state.temps[k].destroy();
			}
		}
	}

	/**
	 * Get the JSX for the current panel.
	 */
	render() {
		switch (this.state.panel) {
			default:
				return null;

			case Panel.INIT:
				return this.renderInit();

			case Panel.EDIT:
			 	return this.renderEdit();

			case Panel.ENTITY:
				return this.renderEntity();

			case Panel.FILTER:
				return this.renderFilter();

			case Panel.TABLE:
				return this.renderTable();

			case Panel.LOADER:
				return this.renderLoader();

			case Panel.CENTURY:
				return this.renderCenturyApp();

			case Panel.CURSUS:
				return this.renderCursusApp();

			case Panel.SRC_COMP:
				return this.renderSourceCompletenessApp();

			case Panel.PROVENANCE:
				return this.renderProvenanceApp();

			case Panel.NOTATION:
				return this.renderNotationApp();

			case Panel.MS_TYPE:
				return this.renderMsTypeApp();
		}
	}

	/* Panel JSX getters */

	/**
	 * Gets the initial view of the Section App, asking the user if they want to filter by country,
	 * library, and manuscript, or load all the sections in Cantus.
	 */
	renderInit() {
		return (<InitPanel
			onBack={this.props.onBack}
			onSubmit={this.onInitSubmit}
		/>);
	}

	/**
	 * Gets the edit screen to create a new Section or edit an existing one.
	 */
	renderEdit() {
		var isNew = Boolean();

		return (<EditPanel
			loadLibraries={this.loadLibraries}
			loadManuscripts={this.loadManuscripts}
			primaries={this.getEditPrimaries()}
			supports={this.state.supports as any}
			temps={this.state.temps}
			onBack={() => {
				this.destroyTemps();
				this.setPanel(Panel.TABLE);
			}}
			onSubmit={this.saveSection}
		/>)
	}

	/**
	 * Gets the entity view of a Section.
	 */
	renderEntity() {
		return (<EntityPanel
		 	onBack={() => this.setPanel(Panel.TABLE)}
			entities = {{
				country: this.state.temps.country || this.state.primaries.country,
				library: this.state.temps.library || this.state.primaries.library,
				manuscript: this.state.temps.manuscript || this.state.primaries.manuscript,
				section: this.state.primaries.section,

				century: this.state.supports.centuries
					.find(c => this.state.primaries.section.centuryID === c.centuryID),

				cursus: this.state.supports.cursuses
					.find(c => this.state.primaries.section.cursusID === c.cursusID),

				provenance: this.state.supports.provs
					.find(p => this.state.primaries.section.provenanceID === p.provenanceID),

				notation: this.state.supports.notations
					.find(n => this.state.primaries.section.notationID === n.notationID),

				sectionType: this.state.supports.msTypes
					.find(mt => this.state.primaries.section.sectionType === mt.msType),

				sourceComp: this.state.supports.srcComps
					.find(sc => this.state.primaries.section.sourceCompletenessID === sc.sourceCompletenessID)
			}}
		/>);
	}

	/**
	 * Gets the view for the user to select filtering entities.
	 */
	renderFilter() {
		return (<FilterPanel
			countries={this.props.countries}
			onBack={() => this.setPanel(Panel.INIT)}
			onSubmit={this.onFilterSubmit}
		/>);
	}

	/**
	 * Gets the table showing the loaded Sections, with CRUD and refresh options.
	 */
	renderTable() {
		return (<TablePanel
			library={this.state.primaries.library}
			manuscript={this.state.primaries.manuscript}
			sections={this.state.primaries.sections}
			onBack={() => this.props.sideloads
				? this.props.onBack()
				: this.setPanel(Panel.INIT)}
			onRefresh={this.reloadSections}
			onEdit={this.openEdit}
			onDelete={this.confirmDelete}
			onView={this.openEntity}

		/>);
	}

	renderCenturyApp() {
		return (<CenturyApp
			centuries={this.state.supports.centuries}
			onBack={() => this.setPanel(Panel.INIT)}
			reloadCenturies={() => this.loadCenturies(centuries => {
				this.setPanel(Panel.CENTURY, s => {
					Century.destroyArray(s.supports.centuries);
					s.supports.centuries = centuries;
					return s;
				});
			})}
		/>);
	}

	renderCursusApp() {
		return (<CursusApp
			cursuses={this.state.supports.cursuses}
			onBack={() => this.setPanel(Panel.INIT)}
			reloadCursuses={() => this.loadCursuses(cursuses => {
				this.setPanel(Panel.CURSUS, s => {
					Cursus.destroyArray(s.supports.cursuses);
					s.supports.cursuses = cursuses;
					return s;
				});
			})}
		/>);
	}

	renderSourceCompletenessApp() {
		return (<SourceCompletenessApp
			sourceCompletenesses={this.state.supports.srcComps}
			onBack={() => this.setPanel(Panel.INIT)}
			reloadSourceCompletenesses={() => this.loadSrcComps(srcComps => {
				this.setPanel(Panel.SRC_COMP, s => {
					Cursus.destroyArray(s.supports.srcComps);
					s.supports.srcComps = srcComps;
					return s;
				});
			})}
		/>);
	}

	renderProvenanceApp() {
		return (<ProvenanceApp
			provenances={this.state.supports.provs}
			onBack={() => this.setPanel(Panel.INIT)}
			reloadProvenances={() => this.loadProvenances(provs => {
				this.setPanel(Panel.PROVENANCE, s => {
					Cursus.destroyArray(s.supports.provs);
					s.supports.provs = provs;
					return s;
				});
			})}
		/>);
	}

	renderNotationApp() {
		return (<NotationApp
			notations={this.state.supports.notations}
			onBack={() => this.setPanel(Panel.INIT)}
			reloadNotations={() => this.loadNotations(notations => {
				this.setPanel(Panel.NOTATION, s => {
					Cursus.destroyArray(s.supports.notations);
					s.supports.notations = notations;
					return s;
				});
			})}
		/>);
	}

	renderMsTypeApp() {
		return (<MsTypeApp
			msTypes={this.state.supports.msTypes}
			onBack={() => this.setPanel(Panel.INIT)}
			reloadMsTypes={() => this.loadMsTypes(msTypes => {
				this.setPanel(Panel.MS_TYPE, s => {
					Cursus.destroyArray(s.supports.msTypes);
					s.supports.msTypes = msTypes;
					return s;
				});
			})}
		/>);
	}

	/**
	 * Gets the loading screen.
	 */
	renderLoader() {
		return <PageLoader inner={this.state.loadMessage} />;
	}

	/* Support loaders */

	/**
	 * Loads the centuries from Cantus.
	 */
	loadCenturies(callback: (a:Century[]) => void) {
		this.setLoader('Loading Centuries...');
		proxyFactory.getSectionProxy().getCenturies((a, e?) => {
			if (e) {
				alert('Error loading Centuries: ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(a);
		});
	}

	/**
	 * Loads the cursuses from Cantus.
	 */
	loadCursuses(callback: (a:Cursus[]) => void) {
		this.setLoader('Loading Cursuses...');
		proxyFactory.getSectionProxy().getCursuses((a, e?) => {
			if (e) {
				alert('Error loading Cursuses: ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(a);
		});
	}

	/**
	 * Loads the Source Completeness from Cantus.
	 */
	loadSrcComps(callback: (a:SourceCompleteness[]) => void) {
		this.setLoader('Loading Source Completenesses...');
		proxyFactory.getSectionProxy().getSourceCompletenesses((a, e?) => {
			if (e) {
				alert('Error loading Source Completenesses: ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(a);
		});
	}

	/**
	 * Loads the Provenances from Cantus.
	 */
	loadProvenances(callback: (a:Provenance[]) => void) {
		this.setLoader('Loading Provenances...');
		proxyFactory.getSectionProxy().getProvenances((a, e?) => {
			if (e) {
				alert('Error loading Provenances: ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(a);
		})
	}

	/**
	 * Loads the Notations from Cantus.
	 */
	loadNotations(callback: (a:Notation[]) => void) {
		this.setLoader('Loading Notations...');
		proxyFactory.getSectionProxy().getNotations((a, e?) => {
			if (e) {
				alert('Error loading Notations: ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(a);
		})
	}

	/**
	 * Loads the Section Types (Manuscript Types) from Cantus.
	 */
	loadMsTypes(callback: (a:MsType[]) => void) {
		this.setLoader('Loading Manuscript Types...');
		proxyFactory.getManuscriptProxy().getMsTypes((a, e?) => {
			if (e) {
				alert('Error loading Manuscript Types: ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(a);
		})
	}

	/**
	 * Loads all the supporting entities of a Section, sets them in state,
	 * and takes a callback to finish setting state.
	 */
	loadSupports(callback: (s:S) => S): void
	{
		var stateSetter = (centuries:Century[], cursuses: Cursus[], srcComps: SourceCompleteness[],
			provs: Provenance[], notations: Notation[], msTypes: MsType[]) =>
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

				callback(s);
			});
		}

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
							if (this.props.sideloads && this.props.sideloads.msTypes) {
								return stateSetter(centuries, cursuses, srcComps, provs, notations,
									this.props.sideloads.msTypes);
							}

							this.loadMsTypes((msTypes:MsType[]) =>
							{
									stateSetter(centuries, cursuses, srcComps, provs, notations, msTypes);
							});
						});
					});
				});
			});
		});
	}

	/* Primary loaders */

	/**
	 * Loads the Sections from Cantus, with optionals libSiglum and msSiglum.
	 */
	loadSections(libSiglum:string, msSiglum:string, callback:(a: sn.Section[]) => void) {
		proxyFactory.getSectionProxy().getSections(libSiglum, msSiglum, (a, e?) => {
			if (e) {
				alert('Error loading Sections: ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(a);
		});
	}

	/**
	 * Loads the Libraries from Cantus, with a countryID.
	 */
	loadLibraries(countryID:string, callback: (a: Library[]) => void) {
		proxyFactory.getLibraryProxy().getLibraries(countryID, (a, e?) => {
			if (e) {
				alert('Error loading Libraries: ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(a);
		});
	}

	/**
	 * Loads the Manuscripts from Cantus, with an optional libSiglum.
	 */
	loadManuscripts(libSiglum: string, callback: (a: Manuscript[]) => void) {
		proxyFactory.getManuscriptProxy().getManuscripts(libSiglum, (a, e?) => {
			if (e) {
				alert('Error loading Manuscripts: ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(a);
		});
	}

	/* Temp loaders */

	/**
	 * Loads an individual Library from Cantus, with its libSiglum.
	 */
	loadLibrary(libSiglum:string, callback: (l:Library) => void) {
		proxyFactory.getLibraryProxy().getLibrary(libSiglum, (l, e?) => {
			if (e) {
				alert('Error loading Library ' + libSiglum + ': ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(l);
		});
	}

	/**
	 * Loads an individual Library from Cantus, with its libSiglum and msSiglum.
	 */
	loadManuscript(libSiglum:string, msSiglum:string, callback:(m:Manuscript) => void) {
		proxyFactory.getManuscriptProxy().getManuscript(libSiglum, msSiglum, (m, e?) => {
			if (e) {
				alert('Error loading Manuscript ' + libSiglum + ' ' + msSiglum + ': ' + e);
				return this.setPanel(Panel.INIT);
			}
			callback(m);
		});
	}

	onInitSubmit(p:Panel) {
		if (p === Panel.TABLE) {
			this.setLoader('Loading Sections...');
			this.loadSections(null, null, sections => {
				this.setPanel(Panel.TABLE, s => {
					sn.Section.destroyArray(s.primaries.sections);
					s.primaries.sections = sections;
					return s;
				});
			});
		}
		else {
			this.setPanel(p);
		}
	}

	onFilterSubmit(c:Country, l:Library, m:Manuscript, ls:Library[], ms:Manuscript[]) {
		this.setLoader('Loading Sections for Manuscript ' + l.libSiglum + ' ' + m.msSiglum + '...');

		this.loadSections(l.libSiglum, m.msSiglum, ss => {
			this.setState((s:S) => {
				Library.destroyArray(s.primaries.libraries);
				Manuscript.destroyArray(s.primaries.manuscripts);
				sn.Section.destroyArray(s.primaries.sections);
				s.primaries.library = null;
				s.primaries.manuscript = null;
				s.primaries.section = null;

				s.primaries.country = c;
				s.primaries.libraries = ls;
				s.primaries.manuscripts = ms;
				s.primaries.library = l;
				s.primaries.manuscript = m;
				s.primaries.sections = ss;

				this.setPanel(Panel.TABLE, null, s);
				return s;
			});
		});
	}

	/**
	 * Called from TablePanel to refresh the view.
	 */
	reloadSections() {
		this.setLoader('Loading Sections...');

		// Get siglums from primaries if the view is filtered
		var libSiglum = (this.state.primaries.library
			? this.state.primaries.library.libSiglum
			: null);
		var msSiglum = (this.state.primaries.manuscript
			? this.state.primaries.manuscript.msSiglum
			: null);

		this.loadSections(libSiglum, msSiglum, sections => {
				this.setState((s:S) => {
					// Destroy the stale section models.
					sn.Section.destroyArray(s.primaries.sections);
					s.primaries.section = null;

					// Set new primary section models.
					s.primaries.sections = sections;

					// Return to the table panel when finished.
					this.setPanel(Panel.TABLE, null, s);
					return s;
				});
			});
	}

	loadTemps(stn:sn.Section, callback: (s:S) => S) {
		var isNew = !Boolean(stn);
		var isFiltered = Boolean(this.state.primaries.manuscript);

		if (!(isFiltered || isNew)) {
			// Set the country temp
			var i = stn.libSiglum.indexOf('-');
			var countryID = stn.libSiglum.slice(0, i);
			var country = this.props.countries.find(c => countryID === c.countryID);

			// Load library temp, then manuscript temp
			this.setLoader('Loading Library ' + stn.libSiglum + '...');
			this.loadLibrary(stn.libSiglum, library => {

				// Load manuscript temp
				this.setLoader('Loading manuscript ' + stn.msSiglum + ' from ' + library.library + '...');
				this.loadManuscript(stn.libSiglum, stn.msSiglum, manuscript => {

					// Set our temps and go to the edit panel.
					this.setState((s:S) => {
						s.primaries.section = stn;

						s.temps = {};
						s.temps.country = country;
						// These two will be destroyed upon exit
						s.temps.library = library;
						s.temps.manuscript = manuscript;

						callback(s);
					});
				});
			});
		}
		else {
			this.setState((s:S) => {
				s.primaries.section = stn;
				callback(s);
			});
		}
	}

	destroyTemps() {
		if (this.state.temps) {
			this.setState(s => {
				if (s.temps.library) {
					s.temps.library.destroy();
					s.temps.library = null;
				}

				if (s.temps.manuscript) {
					s.temps.manuscript.destroy();
					s.temps.manuscript = null;
				}

				s.temps.country = null;
				return s;
			});
		}
	}

	openEntity(stn:sn.Section) {
		this.loadTemps(stn, s => {
			this.setPanel(Panel.ENTITY, null, s);
			return s;
		});
	}

	openEdit(stn?:sn.Section) {
		this.loadTemps(stn, s => {
			s.panel = Panel.EDIT;
			return s;
		});
	}

	getEditPrimaries() {
		var primaries:any = {};
		for (let k in this.state.primaries) {
			primaries[k] = this.state.primaries[k];
		}
		primaries.countries = this.props.countries;
		return primaries;
	}

	confirmDelete(stn:sn.Section) {
		var del = confirm('Delete ' + stn.libSiglum + ' ' + stn.msSiglum + ' ' + stn.sectionID +
			'? This will delete all children of this section as well!');

		if (del) {
			proxyFactory.getSectionProxy().deleteSection(stn.libSiglum, stn.msSiglum, stn.sectionID,
				(success, e?) =>
			{
				if (e) {
					return alert(e);
				}
				if (!success) {
					return alert('Failed to delete section.');
				}

				this.setState((s:S) => {
					// Find the location of section in the array
					var i = s.primaries.sections.findIndex(sec => {
						return (stn.libSiglum === sec.libSiglum
							&& stn.msSiglum === sec.msSiglum
							&& stn.sectionID === sec.sectionID);
					});

					// Destroy the deleted section and remove it from the array
					s.primaries.sections[i].destroy();
					s.primaries.sections.splice(i, 1);
					return s;
				});
			})
		}
	}

	saveSection(p:sn.Properties, isNew: boolean) {
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

		this.destroyTemps();
	}
}
