import * as React from 'react';

import InitPanel from '@src/components/manuscript/ManuscriptInitPanel.tsx';
import FilterPanel from '@src/components/manuscript/ManuscriptFilterPanel.tsx';
import TablePanel from '@src/components/manuscript/ManuscriptTablePanel.tsx';
import MsTypeApp from '@src/components/manuscript/MsTypeApp.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import * as ms from '@src/models/manuscript.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

export enum Panel {
	INIT=0,
	FILTER=1,
	TABLE=2,
	EDIT=3,
	MST=4
}

interface P {
	countries: Array<Country>
	onBack: () => void
}
interface S {
	panel: Panel
	country: Country
	libraries: Array<Library>
	library: Library
	manuscripts: Array<ms.Manuscript>
	manuscript: ms.Manuscript
	[x: string]: any
}

export default class ManuscriptApp extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.INIT,
			country: null,
			libraries: null,
			library: null,
			manuscripts: null,
			manuscript: null
		};
		this.changePanel = this.changePanel.bind(this);
		this.onInitSelect = this.onInitSelect.bind(this);
		this.onFilterLoad = this.onFilterLoad.bind(this);
		this.loadManuscripts = this.loadManuscripts.bind(this);
		this.openEditPanel = this.openEditPanel.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);
	}

	onInitSelect(p:Panel) {
		switch (p) {
			case Panel.FILTER:
			default:
				this.setState((s:S) => {
					s.panel = p;
					return s;
				});
				break;
			case Panel.TABLE:
				proxyFactory.getManuscriptProxy().getManuscripts(null, null, (manuscripts: Array<ms.Manuscript>, e?:string) => {
					if (e) {
						alert(e);
					}
					else {
						this.setState((s:S) => {
							s.panel = p;
							ms.Manuscript.destroyArray(s.manuscripts);
							s.manuscripts = manuscripts;
							return s;
						});
					}
				});
				break;
			case Panel.MST:
				break;
		}
	}

	onFilterLoad(c:Country, l:Library, libraries:Array<Library>) {
		var countryID = c.countryID;
		var libSiglum = l ? l.libSiglum : null;
		console.log(libSiglum);
		proxyFactory.getManuscriptProxy().getManuscripts(countryID, libSiglum, (manuscripts:Array<ms.Manuscript>, e?:string) => {
			if (e) {
				alert(e);
			}
			else {
				this.setState((s:S) => {
					console.log(manuscripts);
					s.panel = Panel.TABLE;
					s.country = c;
					s.library = l;

					ms.Manuscript.destroyArray(s.manuscripts);
					s.manuscripts = manuscripts;
					Library.destroyArray(s.libraries);
					s.libraries = libraries;
					return s;
				});
			}
		});
	}

	changePanel(p:Panel) {
		this.setState((s:S) => {
			s.panel = p;
			return s;
		});
	}

	render() {
		switch (this.state.panel) {
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
					onRefresh={this.loadManuscripts}
					onEdit={this.openEditPanel}
					onDelete={this.confirmDelete}
				/>);
			case Panel.MST:
				return (<MsTypeApp
					onBack={() => this.changePanel(Panel.MST)}
				/>);
		}
	}

	loadManuscripts() {
		var countryID = this.state.country ? this.state.country.countryID : null;
		var libSiglum = this.state.library ? this.state.library.libSiglum : null;
		proxyFactory.getManuscriptProxy().getManuscripts(countryID, libSiglum,
			(manuscripts: Array<ms.Manuscript>, e?:string) =>
		{
			if (e) {
				alert(e);
			}
			else {
				this.setState((s:S) => {
					ms.Manuscript.destroyArray(s.manuscripts);
					s.manuscripts = manuscripts;
					return s;
				});
			}
		});
	}

	openEditPanel(manuscript:ms.Manuscript) {
		this.setState((s:S) => {
			s.panel = Panel.EDIT;
			s.manuscript = manuscript;
			return s;
		})
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
}
