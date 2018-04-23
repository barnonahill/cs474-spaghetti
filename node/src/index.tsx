import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Header from '@src/components/common/Header.tsx';

import InitApp from '@src/components/SpaghettiApp.tsx';
import LibraryApp from '@src/components/library/LibraryApp.tsx';
import ManuscriptApp from '@src/components/manuscript/ManuscriptApp.tsx';

import { Country } from '@src/models/country.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

export enum App {
	INIT=0, // this
	LIB=1,
	MS=2
}

/**
 * Spaghetti is our React Application, composed of a subset of Entity Applications.
 */
class Spaghetti {
	private stack: Array<any>;
	private appContainer: HTMLElement;
	private countries: Array<Country>;

	constructor(private container: HTMLElement) {
		this.stack = [];
		this.appContainer = container.getElementsByTagName('section')[0];
		this.onSelect = this.onSelect.bind(this);

		proxyFactory.getLibraryProxy().getCountries((c:Array<Country>, e?:string) => {
			if (e) {
				alert(e);
			}
			else {
				this.countries = c;
				this.renderInitApp();
			}
		});
	}

	onSelect(a:App) {
		switch (a) {
			case App.INIT:
			default:
				this.renderInitApp();
				break;
			case App.LIB:
				this.renderLibraryApp();
				break;
			case App.MS:
				this.renderManuscriptApp();
				break;
		}
	}

	renderInitApp() {
		ReactDOM.render(
			(<InitApp
				onSelect={this.onSelect}
			/>),
			this.appContainer
		);
	}

	renderLibraryApp() {
		ReactDOM.render(
			(<LibraryApp
				stack={this.stack}
				countries={this.countries}
				onBack={() => this.onSelect(App.INIT)}
			/>),
			this.appContainer
		);
	}

	renderManuscriptApp() {
		ReactDOM.render(
			(<ManuscriptApp
				countries={this.countries}
				onBack={() => this.onSelect(App.INIT)}
			/>),
			this.appContainer
		);
	}
}

const spg: Spaghetti = new Spaghetti(document.querySelector('main'));
spg.renderInitApp();
