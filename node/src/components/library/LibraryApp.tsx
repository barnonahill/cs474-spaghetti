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

import PageLoader from '@src/components/common/PageLoader.tsx';

import CountryPanel from '@src/components/library/LibraryCountryPanel.tsx';
import EntityPanel from '@src/components/library/LibraryEntityPanel.tsx';
import {
	default as EditPanel,
	Val,
	S as EditState
} from '@src/components/library/LibraryEditPanel.tsx';
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
	loadMessage?: string
	editState?: EditState
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
		};

		// Event Listeners
		this.onCountrySelect = this.onCountrySelect.bind(this);

		// Data operators
		this.saveLibrary = this.saveLibrary.bind(this);
		this.loadLibraries = this.loadLibraries.bind(this);

		// State utility helpers
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);

		// Render helpers
		this.renderTablePanel = this.renderTablePanel.bind(this);
		this.renderEditPanel = this.renderEditPanel.bind(this);
	}

	onCountrySelect(country: Country) {
		this.setLoader('Loading ' + country.country + ' Libraries...');

		this.loadLibraries(country, libraries => {
			this.setPanel(Panel.TABLE, s => {
				lib.Library.destroyArray(s.libraries);
				s.library = null;

				s.country = country;
				s.libraries = libraries;
				return s;
			});
		})
	}

	saveLibrary(editState: EditState) {
		this.setLoader('Saving Library ' + editState.lProps.library + '...');
		var onError = (e:string) => {
			alert('Error saving Library: ' + e);
			this.setPanel(Panel.EDIT, s => {
				e = e.toLowerCase();
				for (let k in editState.val) {
					if (editState.lProps[k] && (e.indexOf(editState.val[k]) !== -1 ||
						e.indexOf(k.toLowerCase()) !== -1))
					{
						editState.val[k] = 'error';
					}
				}
				s.editState = editState;

				var i = s.lProps.libSiglum.indexOf('-');
				if (i >= 0 && i < s.lProps.libSiglum.length - 2) {
					s.lProps.libSiglum = s.lProps.libSiglum.slice(i + 1);
				}
				return s;
			});
		};

		const proxy = proxyFactory.getLibraryProxy();
		if (editState.isNew) {
			proxy.createLibrary(editState.lProps, (library, e?) => {
				if (e) {
					onError(e);
				}
				else {
					this.setPanel(Panel.TABLE, s => {
						s.libraries.push(library);
						delete s.editState;
						return s;
					});
				}
			});
		}
		else {
			proxy.updateLibrary(editState.lProps, (library, e?) => {
				if (e) {
					onError(e);
				}
				else {
					this.setPanel(Panel.TABLE, s => {
						var i = s.libraries.findIndex((l:lib.Library) => l.libSiglum === library.libSiglum);
						s.libraries[i].destroy();

						if (library.countryID === s.country.countryID) {
							s.libraries[i] = library;
						}
						else {
							s.libraries.splice(i, 1);
						}
						delete s.editState;
						return s;
					});
				}
			});
		}
	}

	deleteLibrary(l: lib.Library) {
		this.setLoader('Deleting Library ' + l.library + '...');
		proxyFactory.getLibraryProxy().deleteLibrary(l.libSiglum, (success, e?) => {
			if (e) {
				alert('Error deleting Library: ' + e);
				this.setPanel(Panel.TABLE);
			}
			else if (success) {
				this.setPanel(Panel.TABLE, s => {
					var i = s.libraries.findIndex((o: lib.Library) => o.libSiglum === l.libSiglum);
					s.libraries[i].destroy();
					s.libraries.splice(i,1);
					return s;
				});
			}
			else {
				alert('Could not delete ' + l.library);
				this.setPanel(Panel.TABLE);
			}
		})
	}

	render() {
		switch (this.state.panel) {
			case Panel.INIT:
			default:
				return (<CountryPanel
					country={this.state.country || null}
					countries={this.props.countries}
					onSubmit={this.onCountrySelect}
					onBack={this.props.onBack}
				/>);

			case Panel.TABLE:
				return this.renderTablePanel();

			case Panel.ENTITY:
				return (<EntityPanel
					countries={this.props.countries}
					country={this.state.country}
					library={this.state.library}
					onBack={() => this.setPanel(Panel.TABLE)}
				/>);

			case Panel.EDIT:
				return this.renderEditPanel();

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage} />
		}
	}

	renderTablePanel() {
		return (<TablePanel
			key="panel"
			country={this.state.country}
			libraries={this.state.libraries}
			onBack={() => this.setPanel(Panel.INIT)}
			onRefresh={() => this.loadLibraries(this.state.country, libraries => {
				this.setPanel(Panel.TABLE, s => {
					lib.Library.destroyArray(s.libraries);
					s.library = null;
					s.libraries = libraries;
					return s;
				});
			})}

			onEdit={library => this.setPanel(Panel.EDIT, s => {
				s.library = library;
				return s;
			})}

			onView={library => this.setPanel(Panel.ENTITY, s => {
				s.library = library;
				return s;
			})}

			onDelete={library => {
				var del = confirm('Delete ' + library.library + '?');
				if (del) {
					this.deleteLibrary(library);
				}
			}}
		/>);
	}

	renderEditPanel() {
		var es: Partial<EditState> = this.state.editState || {};
		if (!es.lProps && this.state.library) {
			es.lProps = this.state.library.toProperties();
		}

		return (<EditPanel
			country={this.state.country}
			onSubmit={this.saveLibrary}
			onBack={() => this.setPanel(Panel.TABLE,null)}
			editState={es}
		/>);
	}

	loadLibraries(country: Country, callback: (libraries: lib.Library[]) => void) {
		this.setLoader('Loading ' + country.country + ' Libraries...');

		proxyFactory.getLibraryProxy().getLibraries(country.countryID, (libraries, e?) => {
			if (e) {
				alert('Error loading Libraries: ' + e);
				this.setPanel(Panel.INIT);
			}
			else {
				callback(libraries);
			}
		});
	}
}
