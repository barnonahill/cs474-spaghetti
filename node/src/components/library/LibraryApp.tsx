import * as React from 'react';

import {
	Alert,
	Button,
	Col,
	ControlLabel,
	Form,
	FormGroup
} from 'react-bootstrap';
import {
	default as Select,
	Options,
	Option
} from 'react-select';

import Header from '@src/components/common/Header.tsx';
import PageLoader from '@src/components/common/PageLoader.tsx';

import CountryPanel from '@src/components/library/LibraryCountryPanel.tsx';
import EntityPanel from '@src/components/library/LibraryEntityPanel.tsx';
import EditPanel from '@src/components/library/LibraryEditPanel.tsx';
import {
	default as TablePanel,
	ButtonType as TButtonType
} from '@src/components/library/LibraryTablePanel.tsx';
import StateUtils from '@src/components/StateUtilities.ts'

import { Country } from '@src/models/country.ts';
import * as lib from '@src/models/library.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum Panel {
	INIT = 0,
	FILTER = 1,
	LOADER = 2,
	TABLE = 3,
	ENTITY = 4,
	EDIT = 5
}

interface P {
	stack: Array<any>
	countries: Array<Country>
	onBack: () => void
}

interface S {
	panel: Panel
	country?: Country
	library?: lib.Library
	libraries: Array<lib.Library>
	loadingMessage: string
	[x: string]: any
}

export default class LibraryApp extends React.Component<P, S> {
	public readonly state: S;
	public readonly props: P;

	private setPanel: (panel: Panel, callback?: (s:S) => S, state?:S) => void
	private setLoader: (loadMessage: string, callback?: (s:S) => S, state?:S) => void

	constructor(props: P) {
		super(props);
		this.state = {
			panel: Panel.INIT,
			country: null,
			library: null,
			libraries: null,
			loadingMessage: 'Loading Libraries...'
		};

		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onTableClick = this.onTableClick.bind(this);
		this.onEditSubmit = this.onEditSubmit.bind(this);
		this.reloadLibraries = this.reloadLibraries.bind(this);

		// State utility helpers
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);
	}

	onCountrySelect(c: Country) {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadingMessage = 'Loading ' + c.country + ' Libraries...';
			return s;
		});

		proxyFactory.getLibraryProxy().getLibraries(c.countryID, (libs:Array<lib.Library>, e?:string) => {
			if (e) {
				alert(e);
			}
			else {
				this.setState((s:S) => {
					s.library = null;
					lib.Library.destroyArray(s.libraries);

					s.panel = Panel.TABLE;
					s.country = c;
					s.libraries = libs;
					return s;
				});
			}
		});
	}

	onTableClick(l:lib.Library, t:TButtonType) {
		switch (t) {
			case TButtonType.VIEW:
			default:
				this.setPanel(Panel.ENTITY, s => {
					s.library = l;
					return s;
				});
				break;
			case TButtonType.EDIT:
				this.setPanel(Panel.EDIT, s => {
					s.library = l;
					return s;
				});
				break;
			case TButtonType.DEL:
				var del = confirm('Delete ' + l.library + '?');
				if (del) {
					this.deleteLibrary(l);
				}
				break;
		}
	}

	onEditSubmit(p:lib.Properties, isNew:boolean) {
		if (isNew) {
			proxyFactory.getLibraryProxy().createLibrary(p, (l:lib.Library, e?:string) => {
				if (e) {
					alert(e);
				}
				else {
					this.setState((s:S) => {
						s.libraries.push(l);
						s.panel = Panel.TABLE;
						return s;
					});
				}
			});
		}
		else {
			proxyFactory.getLibraryProxy().updateLibrary(p, (library:lib.Library, e?:string) => {
				if (e) {
					alert(e);
				}
				else {
					this.setState((s:S) => {
						var i = s.libraries.findIndex((l:lib.Library) => l.libSiglum === library.libSiglum);
						s.libraries[i].destroy();

						if (library.countryID === s.country.countryID) {
							s.libraries[i] = library;
						}
						else {
							s.libraries.splice(i, 1);
						}

						s.panel = Panel.TABLE;
						return s;
					});
				}
			});
		}
	}

	deleteLibrary(l: lib.Library) {
		proxyFactory.getLibraryProxy().deleteLibrary(l.libSiglum, (success:boolean, err?:string) => {
			if (err) {
				alert(err);
			}
			else if (success) {
				this.setState((s:S) => {
					var i = s.libraries.findIndex((o: lib.Library) => o.libSiglum === l.libSiglum);
					s.libraries[i].destroy();
					s.libraries.splice(i,1);
					return s;
				});
			}
			else {
				alert('Could not delete ' + l.library);
			}
		})
	}

	render() {
		switch (this.state.panel) {
			case Panel.INIT:
			default:
				return [
					<Header key="header" min>Libraries</Header>,
					(<CountryPanel
						country={this.state.country || null}
						countries={this.props.countries}
						onSubmit={this.onCountrySelect}
						onBack={this.props.onBack}
						key="panel"
					/>)
				];
			case Panel.TABLE:
				return (<TablePanel
						key="panel"
						country={this.state.country}
						libraries={this.state.libraries}
						onClick={this.onTableClick}
						onRefresh={() => this.onCountrySelect(this.state.country)}
						onBack={() => this.setPanel(Panel.INIT)}
					/>);

			case Panel.ENTITY:
			return (<EntityPanel
				countries={this.props.countries}
				country={this.state.country}
				library={this.state.library}
				onBack={() => this.setPanel(Panel.TABLE,null)}
			/>);

			case Panel.EDIT:
				var header = this.state.country.country + ' - ' +
				 	(this.state.library ? 'Edit' : 'Create') + ' Library';

				return [
					<Header key="header" min>{header}</Header>,
					(<EditPanel
						key="panel"
						library={this.state.library || null}
						country={this.state.country}
						onSubmit={this.onEditSubmit}
						onBack={() => this.setPanel(Panel.TABLE,null)}
					/>)
				];
			case Panel.LOADER:
				return <PageLoader inner={this.state.loadingMessage} />
		}
	}

	reloadLibraries() {
		this.setState((s:S) => {
			s.panel = Panel.LOADER;
			s.loadingMessage = 'Loading ' + s.country.country + ' Libraries...';
			return s;
		});

		proxyFactory.getLibraryProxy().getLibraries(this.state.country.countryID,
		(libraries: lib.Library[], e?:string) =>
		{
			if (e) {
				alert(e);
			}
			else {
				this.setState((s:S) => {
					lib.Library.destroyArray(s.libraries);

					s.panel = Panel.TABLE;
					s.libraries = libraries;
					return s;
				});
			}
		});
	}
}
