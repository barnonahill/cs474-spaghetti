import * as React from 'react';

import InitPanel from '@src/components/manuscript/ManuscriptInitPanel.tsx';
import FilterPanel from '@src/components/manuscript/ManuscriptFilterPanel.tsx';
import TablePanel from '@src/components/manuscript/ManuscriptTablePanel.tsx';
import EntityPanel from '@src/components/manuscript/ManuscriptEntityPanel.tsx';
import EditPanel from '@src/components/manuscript/ManuscriptEditPanel.tsx';
import MsTypeApp from '@src/components/manuscript/MsTypeApp.tsx';
import PageLoader from '@src/components/common/PageLoader.tsx';

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

		this.changePanel = this.changePanel.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		this.onFilterLoad = this.onFilterLoad.bind(this);
		this.onInitSelect = this.onInitSelect.bind(this);
		this.onEntityBack = this.onEntityBack.bind(this);

		this.openEditPanel = this.openEditPanel.bind(this);
		this.openEntityPanel = this.openEntityPanel.bind(this);

		this.loadLibraries = this.loadLibraries.bind(this);
		this.loadManuscripts = this.loadManuscripts.bind(this);
		this.loadMsTypes = this.loadMsTypes.bind(this);

		this.reloadManuscripts = this.reloadManuscripts.bind(this);
		this.saveManuscript = this.saveManuscript.bind(this);
	}

	componentDidMount() {
		// Async, uses proxy.
		this.loadMsTypes((state:S, msTypes:Array<MsType>) => {
			state.msType = null;
			MsType.destroyArray(state.msTypes);

			state.panel = Panel.INIT;
			state.msTypes = msTypes;
			return state;
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
					onSelect={this.onInitSelect}
				/>);
			case Panel.FILTER:
				return (<FilterPanel
					countries={this.props.countries}
					onBack={() => this.changePanel(Panel.INIT)}
					onSelect={this.onFilterLoad}
				/>);
			case Panel.TABLE:
				return (<TablePanel
					country={this.state.country}
					library={this.state.library}
					manuscripts={this.state.manuscripts}
					onBack={() => this.changePanel(Panel.INIT)}
					onRefresh={this.reloadManuscripts}
					onEdit={this.openEditPanel}
					onDelete={this.confirmDelete}
					onView={this.openEntityPanel}
				/>);
			case Panel.ENTITY:
				return (<EntityPanel
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
					onBack={() => this.changePanel(Panel.TABLE)}
					onSubmit={this.saveManuscript}
				/>);
			case Panel.MST:
				return (<MsTypeApp
					msTypes={this.state.msTypes}
					onBack={() => this.changePanel(Panel.INIT)}
					replaceMsTypes={(m) => this.setState((s:S) => {
						s.msTypes = m;
						return s;
					})}
				/>);
		}
	}

	changePanel(p:Panel) {
		this.setState((s:S) => {
			s.panel = p;
			return s;
		});
	}

	confirmDelete(manuscript:ms.Manuscript) {
		var del = confirm('Delete ' + manuscript.libSiglum + ' ' + manuscript.msSiglum + '?');
		if (del) {
			proxyFactory.getManuscriptProxy().deleteManuscript(manuscript.libSiglum, manuscript.msSiglum,
				(s:boolean, e?:string) =>
			{
				if (e) {
					alert(e);
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
					alert('Could not delete ' + manuscript.libSiglum + ' ' + manuscript.msSiglum);
				}
			});
		}
	}

	onFilterLoad(c:Country, l:Library, libraries:Array<Library>) {
		var countryID = c.countryID;
		var libSiglum = l ? l.libSiglum : null;

		this.loadManuscripts(countryID, libSiglum, false, (s:S, manuscripts: Array<ms.Manuscript>) => {
			s.panel = Panel.TABLE;

			ms.Manuscript.destroyArray(s.manuscripts);
			Library.destroyArray(s.libraries);

			s.country = c;
			s.library = l;
			s.libraries = libraries;
			s.manuscripts = manuscripts;
			return s;
		});
	}

	onInitSelect(p:Panel) {
		switch (p) {
			case Panel.FILTER:
				this.setState((s:S) => {
					s.panel = p;
					return s;
				});
				break;

			case Panel.TABLE:
				this.setState((s:S) => {
					s.panel = Panel.LOADER;
					s.loadMessage = "Loading Manuscripts...";
				});

				this.loadManuscripts(null, null, false, (s:S, manuscripts:Array<ms.Manuscript>) => {
					s.panel = p;
					Library.destroyArray(s.libraries);
					ms.Manuscript.destroyArray(s.manuscripts);

					s.country = null;
					s.libraries = null;
					s.manuscripts = manuscripts;
					return s;
				});
				break;

			case Panel.MST:
				this.setState((s:S) => {
					s.panel = p;
					return s;
				});
				break;
			default:
				break;
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

	loadManuscripts(countryID:string, libSiglum:string, useState:boolean,
		stateSetter?: (s:S, m:Array<ms.Manuscript>) => S)
	{
		if (useState) {
			countryID = this.state.country ? this.state.country.countryID : null;
			libSiglum = this.state.library ? this.state.library.libSiglum : null
		}

		proxyFactory.getManuscriptProxy().getManuscripts(countryID, libSiglum,
			(manuscripts: Array<ms.Manuscript>, e?:string) =>
		{
			if (e) {
				alert(e);
			}
			else {
				this.setState((s:S) => {
					if (stateSetter) {
						return stateSetter(s, manuscripts);
					}
					else {
						ms.Manuscript.destroyArray(s.manuscripts);
						s.manuscripts = manuscripts;
						return s;
					}
				});
			}
		});
	}

	loadMsTypes(stateSetter?: (s:S, msTypes: Array<MsType>) => S) {
		proxyFactory.getManuscriptProxy().getMsTypes((msTypes:Array<MsType>, e?:string) => {
			if (e) {
				alert(e);
			}
			else {
				this.setState((s:S) => {
					if (stateSetter) {
						return stateSetter(s, msTypes);
					}
					else {
						s.msType = null;
						MsType.destroyArray(s.msTypes);
						s.msTypes = msTypes;
						return s;
					}
				});
			}
		});
	}

	reloadManuscripts() {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadMessage = 'Loading Manuscripts...';
			return s;
		});

		this.loadManuscripts(null, null, true, (state:S, manuscripts:ms.Manuscript[]) => {
			ms.Manuscript.destroyArray(state.manuscripts);

			state.panel = Panel.TABLE;
			state.manuscripts = manuscripts;
			return state;
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
