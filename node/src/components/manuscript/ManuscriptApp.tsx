import * as React from 'react';

import InitPanel from '@src/components/manuscript/ManuscriptInitPanel.tsx';
import FilterPanel from '@src/components/manuscript/ManuscriptFilterPanel.tsx';
import TablePanel from '@src/components/manuscript/ManuscriptTablePanel.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import * as ms from '@src/models/manuscript.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

export enum Panel {
	INIT=0,
	FILTER=1,
	TABLE=2
}

interface P {
	countries: Array<Country>
	onBack: () => void
}
interface S {
	panel: Panel
	country?: Country
	libraries?: Array<Library>
	library?: Library
	manuscripts?: Array<ms.Manuscript>
	[x: string]: any
}

export default class ManuscriptApp extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.INIT
		};
		this.changePanel = this.changePanel.bind(this);
		this.onInitSelect = this.onInitSelect.bind(this);
		this.onFilterLoad = this.onFilterLoad.bind(this);
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
				/>);
		}
	}
}
