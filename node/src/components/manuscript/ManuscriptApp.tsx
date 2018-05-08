import * as React from 'react';

import InitPanel from '@src/components/manuscript/ManuscriptInitPanel.tsx';
import FilterPanel from '@src/components/manuscript/ManuscriptFilterPanel.tsx';
import TablePanel from '@src/components/manuscript/ManuscriptTablePanel.tsx';
import EntityPanel from '@src/components/manuscript/ManuscriptEntityPanel.tsx';
import EditPanel from '@src/components/manuscript/ManuscriptEditPanel.tsx';
import MsTypeApp from '@src/components/msType/MsTypeApp.tsx';
import PageLoader from '@src/components/common/PageLoader.tsx';

import StateUtils from '@src/components/StateUtilities.ts'

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import * as ms from '@src/models/manuscript.ts';
import { MsType } from '@src/models/msType.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

export enum Panel {
	INIT=0,
	FILTER=1,
	TABLE=2,
	ENTITY=3,
	EDIT=4,
	MST=5,
	LOADER=6
}

interface P {
	countries: Array<Country>
	onBack: () => void
	// Load to this panel
	panel?: Panel
	country?: Country
	library?: Library
}
interface S {
	panel: Panel
	loadMessage: string
	country: Country
	libraries: Array<Library>
	library: Library
	manuscripts: Array<ms.Manuscript>
	manuscript: ms.Manuscript
	msType: MsType
	msTypes: Array<MsType>
	tempCountry: boolean
	tempLibrary: boolean
	[x: string]: any
}

export default class ManuscriptApp extends React.Component<P,S> {
	public readonly props: P
	public readonly state: S

	private setPanel: (panel: Panel, callback?: (s:S) => S, state?:S) => void
	private setLoader: (loadMessage: string, callback?: (s:S) => S, state?:S) => void

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.LOADER,
			loadMessage: 'Loading Manuscript Types...',
			country: null,
			libraries: null,
			library: null,
			manuscripts: null,
			manuscript: null,
			msTypes: null,
			msType: null,
			tempCountry: false,
			tempLibrary: false
		};

		// Panel event listeners
		this.onFilterSubmit = this.onFilterSubmit.bind(this);
		this.onInitSubmit = this.onInitSubmit.bind(this);
		this.onEntityBack = this.onEntityBack.bind(this);

		// Panel openers
		this.openEditPanel = this.openEditPanel.bind(this);
		this.openEntityPanel = this.openEntityPanel.bind(this);

		// Data loaders
		this.loadLibraries = this.loadLibraries.bind(this);
		this.loadManuscripts = this.loadManuscripts.bind(this);
		this.loadMsTypes = this.loadMsTypes.bind(this);

		// Data manipulators
		this.saveManuscript = this.saveManuscript.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// State helpers
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);
	}

	componentDidMount() {
		// Async, uses proxy.
		this.setLoader('Loading Manuscript Types...');
		this.loadMsTypes(msTypes => {

			if (this.props.panel === Panel.TABLE) {
				// Opened from LibraryEntityPanel
				this.setLoader('Loading Manuscripts...');
				this.loadManuscripts(this.props.library.libSiglum, manuscripts => {
					this.setPanel(Panel.TABLE, s => {
						Country.destroyArray(s.msTypes);
						Country.destroyArray(s.manuscripts);
						s.msType = null;
						s.manuscript = null;

						s.msTypes = msTypes;
						s.manuscripts = manuscripts;
						s.country = this.props.country;
						s.library = this.props.library;
						return s;
					});
				});
			}

			else {
				this.setPanel(Panel.INIT, s => {
					Country.destroyArray(s.msTypes);
					s.msType = null;

					s.msTypes = msTypes;
					return s;
				});
			}
		});
	}

	render() {
		switch (this.state.panel) {
			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage} />;
			case Panel.INIT:
			default:
				return (<InitPanel
					onBack={this.props.onBack}
					onSelect={this.onInitSubmit}
				/>);

			case Panel.FILTER:
				return (<FilterPanel
					countries={this.props.countries}
					onBack={() => this.setPanel(Panel.INIT)}
					onSelect={this.onFilterSubmit}
				/>);

			case Panel.TABLE:
				return (<TablePanel
					country={this.state.country}
					library={this.state.library}
					manuscripts={this.state.manuscripts}

					onRefresh={() => {
						var libSiglum = (this.state.library ? this.state.library.libSiglum : null);
						this.loadManuscripts(libSiglum, manuscripts => {
							this.setState((s:S) => {
								Country.destroyArray(s.manuscripts);
								s.manuscript = null;

								s.manuscripts = manuscripts;
								this.setPanel(Panel.TABLE, null, s);
								return s;
							});
						});
					}}

					onEdit={this.openEditPanel}
					onDelete={this.confirmDelete}
					onView={this.openEntityPanel}
					onBack={this.props.panel === Panel.TABLE
						? this.props.onBack
						: () => this.setPanel(Panel.INIT)}
				/>);

			case Panel.ENTITY:
				return (<EntityPanel
					// Needed if EntityPanel opens SectionApp
					countries={this.props.countries}
					libraries={this.state.libraries}
					manuscripts={this.state.manuscripts}
					msTypes={this.state.msTypes}

					// Needed for Entity view
					country={this.state.country}
					library={this.state.library}
					manuscript={this.state.manuscript}

					msType={this.state.msType}
					onBack={this.onEntityBack}
				/>);

			case Panel.EDIT:
				return (<EditPanel
					countries={this.props.countries}
					msTypes={this.state.msTypes}
					manuscript={this.state.manuscript}
					onBack={() => this.setPanel(Panel.TABLE)}
					onSubmit={this.saveManuscript}
				/>);

			case Panel.MST:
				return (<MsTypeApp
					msTypes={this.state.msTypes}
					onBack={() => this.setPanel(Panel.INIT)}

					reloadMsTypes={() => {
						this.loadMsTypes(msTypes => {
							this.setState((s:S) => {
								Country.destroyArray(s.msTypes);
								s.msType = null;

								s.msTypes = msTypes;
								this.setPanel(Panel.MST, null, s);
								return s;
							});
						})
					}}
				/>);
		}
	}

	confirmDelete(manuscript:ms.Manuscript) {
		var del = confirm('Delete ' + manuscript.libSiglum + ' ' + manuscript.msSiglum + '?');
		if (del) {
			this.setLoader('Deleting Manuscript ' + manuscript.libSiglum + ' ' + manuscript.msSiglum + '...');
			proxyFactory.getManuscriptProxy().deleteManuscript(manuscript.libSiglum, manuscript.msSiglum,
				(s:boolean, e?:string) =>
			{
				if (e) {
					alert('Error deleting Manuscript: ' + e);
					this.setPanel(Panel.TABLE);
				}
				else if (s) {
					this.setState((s:S) => {
						var i = s.manuscripts.findIndex((m: ms.Manuscript) => {
							return m.libSiglum === manuscript.libSiglum &&
								m.msSiglum === manuscript.msSiglum;
						});
						s.manuscripts[i].destroy();
						s.manuscripts.splice(i, 1);
						return s;
					});
				}
				else {
					alert('Could not delete ' + manuscript.libSiglum + ' ' + manuscript.msSiglum +
						'. No error was provided.');
					this.setPanel(Panel.TABLE);
				}
			});
		}
	}

	onFilterSubmit(c:Country, l:Library, libraries:Array<Library>) {
		var countryID = c.countryID;
		var libSiglum = l ? l.libSiglum : null;
		this.setLoader('Loading manuscripts for ' + l.library + ', ' + c.country);

		this.loadManuscripts(libSiglum, manuscripts => {
			this.setPanel(Panel.TABLE, (s:S) => {
				ms.Manuscript.destroyArray(s.manuscripts);
				Library.destroyArray(s.libraries);

				s.country = c;
				s.library = l;
				s.libraries = libraries;
				s.manuscripts = manuscripts;
				return s;
			});
		});
	}

	onInitSubmit(p:Panel) {
		if (p === Panel.TABLE) {
			this.setLoader("Loading Manuscripts...");

			this.loadManuscripts(null, manuscripts => {
				this.setPanel(p, (s:S) => {
					Library.destroyArray(s.libraries);
					ms.Manuscript.destroyArray(s.manuscripts);
					s.country = null;
					s.library = null;

					s.manuscripts = manuscripts;
					return s;
				});
			});
		}
		else {
			this.setPanel(p);
		}
	}

	onEntityBack() {
		this.setState((s:S) => {
			if (s.tempCountry) {
				s.country = null;
			}
			if (s.tempLibrary) {
				s.library = null;
			}
			s.panel = Panel.TABLE;
			return s;
		});
	}

	openEditPanel(manuscript:ms.Manuscript) {
		this.setState((s:S) => {
			s.panel = Panel.EDIT;
			s.manuscript = manuscript;
			return s;
		})
	}

	openEntityPanel(manuscript:ms.Manuscript) {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadMessage = 'Loading Manuscript...';
			s.manuscript = manuscript;
		});

		var tempCountry = false;
		var tempLibrary = false;
		var msType: MsType;
		if (!(this.state.msType && manuscript.msType === this.state.msType.msType)) {
			// Find the correct msType
			msType = this.state.msTypes.find((m:MsType) => {
				return manuscript.msType === m.msType;
			});
		}
		else {
			msType = this.state.msType;
		}

		if (!(this.state.library && manuscript.libSiglum === this.state.library.libSiglum)) {
			tempLibrary = true;
			// Get the correct library
			var country: Country;
			if (!(this.state.country &&
				manuscript.libSiglum.indexOf(this.state.country.countryID) === -1))
			{
				tempCountry = true;
				// Find the correct country
				var i = manuscript.libSiglum.indexOf('-');
				var countryID = manuscript.libSiglum.slice(0, i);
				country = this.props.countries.find((c:Country) => {
					return countryID === c.countryID;
				});
			}
			else {
				country = this.state.country;
			}

			// Load the libraries and update state with correct entities
			this.loadLibraries(country.countryID, (state:S, libraries:Array<Library>) => {
				state.library = null;
				Library.destroyArray(state.libraries);

				state.country = country;
				state.libraries = libraries;
				state.library = libraries.find((l:Library) => {
					return manuscript.libSiglum === l.libSiglum;
				});

				state.msType = msType;
				state.tempCountry = tempCountry;
				state.tempLibrary = tempLibrary;
				state.panel = Panel.ENTITY;
				return state;
			});
		}
		else {
			this.setState((s:S) => {
				s.msType = msType;
				s.tempCountry = tempCountry;
				s.tempLibrary = tempLibrary;
				s.panel = Panel.ENTITY;
				return s;
			});
		}
	}

	loadLibraries(countryID:string, stateSetter?: (s:S, l:Array<Library>) => S) {
		proxyFactory.getLibraryProxy().getLibraries(countryID, (libraries: Array<Library>, e?:string) => {
			if (e) {
				alert(e);
			}
			else {
				this.setState((s:S) => {
					if (stateSetter) {
						return stateSetter(s, libraries);
					}
					else {
						s.library = null;
						Library.destroyArray(s.libraries);
						s.libraries = libraries;
						return s;
					}
				});
			}
		});
	}

	loadManuscripts(libSiglum:string, callback: (manuscripts: ms.Manuscript[]) => void)
	{
		var loadMessage = 'Loading Manuscripts';
		loadMessage += (libSiglum
			? ' for library ' + libSiglum
			: '...');
		this.setLoader(loadMessage);

		proxyFactory.getManuscriptProxy().getManuscripts(libSiglum,
			(manuscripts: ms.Manuscript[], e?:string) =>
		{
			if (e) {
				alert('Error loading manuscripts: ' + e);
				this.setPanel(Panel.INIT);
			}
			else {
				callback(manuscripts);
			}
		});
	}

	loadMsTypes(callback: (msTypes: MsType[]) => void) {
		this.setLoader('Loading Manuscript Types...');

		proxyFactory.getManuscriptProxy().getMsTypes((msTypes:Array<MsType>, e?:string) => {
			if (e) {
				alert('Error loading Manuscript Types: ' + e);
				this.props.onBack();
			}
			else {
				callback(msTypes);
			}
		});
	}

	saveManuscript(props: ms.Properties, isNew: boolean) {
		if (isNew) {
			proxyFactory.getManuscriptProxy().createManuscript(props, (man, e?) => {
				if (e) {
					alert(e);
				}
				else {
					this.setState((s:S) => {
						s.manuscripts.push(man);
						s.panel = Panel.TABLE;
						return s;
					});
				}
			});
		}
		else {
			proxyFactory.getManuscriptProxy().updateManuscript(props, (man, e?) => {
				if (e) {
					alert(e);
				}
				else {
					this.setState((s:S) => {
						var i = s.manuscripts.findIndex(m => {
							return man.libSiglum === m.libSiglum &&
								man.msSiglum === m.msSiglum;
						});

						s.manuscripts[i].destroy();
						s.manuscripts[i] = man;
						s.panel = Panel.TABLE;
						return s;
					})
				}
			});
		}
	}
}
