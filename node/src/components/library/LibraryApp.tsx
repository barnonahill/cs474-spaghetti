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

import CountryPanel from '@src/components/library/LibraryCountryPanel.tsx';
import EntityPanel from '@src/components/library/LibraryEntityPanel.tsx';
import EditPanel from '@src/components/library/LibraryEditPanel.tsx';
import {
	default as TablePanel,
	ButtonType as TButtonType
} from '@src/components/library/LibraryTablePanel.tsx';

import { Country } from '@src/models/country.ts';
import * as lib from '@src/models/library.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum View {
	INIT = 0,
	TABLE = 1,
	ENTITY = 2,
	EDIT = 3,
}

interface Properties {
	stack: Array<any>
	countries: Array<Country>
	//onBack: () => void
}

interface State {
	view: View
	country?: Country
	library?: lib.Library
	libraries: Array<lib.Library>
	[x: string]: any
}

export default class LibraryApp extends React.Component<Properties, State> {
	constructor(props: Properties) {
		super(props);
		this.state = {
			view: View.INIT,
			country: null,
			library: null,
			libraries: null
		};

		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onTableClick = this.onTableClick.bind(this);
		this.onEditSubmit = this.onEditSubmit.bind(this);
	}

	onCountrySelect(c: Country) {
		proxyFactory.getLibraryProxy().getLibraries(c.countryID, (libs:Array<lib.Library>, e?:string) => {
			if (e) {
				alert(e);
			}
			else {
				if (this.state.libraries) {
					lib.Library.destroyArray(this.state.libraries);
				}

				this.setState((s:State) => {
					s.view = View.TABLE;
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
				this.changeView(View.ENTITY,{library:l});
				break;
			case TButtonType.EDIT:
				this.changeView(View.EDIT,{library:l});
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
					this.setState((s:State) => {
						s.libraries.push(l);
						s.view = View.TABLE;
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
					this.setState((s:State) => {
						var i = s.libraries.findIndex((l:lib.Library) => l.libSiglum === library.libSiglum);
						s.libraries[i].destroy();

						if (library.countryID === s.country.countryID) {
							s.libraries[i] = library;
						}
						else {
							s.libraries.splice(i, 1);
						}

						s.view = View.TABLE;
						return s;
					});
				}
			});
		}
	}

	changeView(v:View, stateOpts:Partial<State>) {
		this.setState((s:State) => {
			s.view = v;

			if (v === View.INIT && s.libraries) {
				lib.Library.destroyArray(s.libraries);
				s.libraries = null;
			}

			if (stateOpts) {
				for (let k in stateOpts) {
					s[k] = stateOpts[k];
				}
			}
			return s;
		});
	}

	deleteLibrary(l: lib.Library) {
		proxyFactory.getLibraryProxy().deleteLibrary(l.libSiglum, (success:boolean, err?:string) => {
			if (err) {
				alert(err);
			}
			else if (success) {
				this.setState((s:State) => {
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
		switch (this.state.view) {
			case View.INIT:
			default:
				return [
					<Header key="header" min>Libraries</Header>,
					(<CountryPanel
						country={this.state.country || null}
						countries={this.props.countries}
						onSubmit={this.onCountrySelect}
						key="panel"
					/>)
				];
			case View.TABLE:
				return [
					<Header key="header" min>Libraries - {this.state.country.country}</Header>,
					(<TablePanel
						key="panel"
						country={this.state.country}
						libraries={this.state.libraries}
						onClick={this.onTableClick}
						onRefresh={() => this.onCountrySelect(this.state.country)}
						onBack={() => this.changeView(View.INIT,{country:this.state.country})}
					/>)
				];
			case View.ENTITY:
				return [
					<Header key="header" min>{this.state.library.library}</Header>,
					(<EntityPanel
						key="panel"
						country={this.state.country}
						library={this.state.library}
						onBack={() => this.changeView(View.TABLE,null)}
					/>)
				];
			case View.EDIT:
				var header = this.state.country.country + ' - ' +
				 	(this.state.library ? 'Edit' : 'Create') + ' Library';

				return [
					<Header key="header" min>{header}</Header>,
					(<EditPanel
						key="panel"
						library={this.state.library || null}
						country={this.state.country}
						onSubmit={this.onEditSubmit}
						onBack={() => this.changeView(View.TABLE,null)}
					/>)
				];
		}
	}
}
