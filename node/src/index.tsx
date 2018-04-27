import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Header from '@src/components/common/Header.tsx';

import InitApp from '@src/components/SpaghettiApp.tsx';
import LibraryApp from '@src/components/library/LibraryApp.tsx';
import ManuscriptApp from '@src/components/manuscript/ManuscriptApp.tsx';
import SectionApp from '@src/components/section/SectionApp.tsx';
import PageLoader from '@src/components/common/PageLoader.tsx';

import { Country } from '@src/models/country.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

export enum App {
	LOADER=0,
	INIT=1,
	LIB=2,
	MS=3,
	SECTION=4
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

		// Render loading panel if we haven't loaded countries within 400ms
		window.setTimeout(() => {
			if (!this.countries) {
				this.renderLoader();
			}
		}, 400);

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
			case App.SECTION:
				this.renderSectionApp();
				break;
		}
	}

	renderLoader() {
		ReactDOM.render(
			<PageLoader inner="Loading Countries..." />,
			this.appContainer
		);
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

	renderSectionApp() {
		ReactDOM.render(
			(<SectionApp
				countries={this.countries}
				onBack={() => this.onSelect(App.INIT)}
			/>),
			this.appContainer
		);
	}
}

export const TABLE_CONSTANTS = {
	HEIGHT: window.innerHeight - 85,
	WIDTH: window.innerWidth - 50,
	CLASS: "mb5",
	ROW_CLASS: "tr",
	ROW_HEIGHT: 50,
	HEADER_HEIGHT: 40
};

/**
 * Adjusts the width and height constants for a table.
 */
function adjustTableConstants() {
	TABLE_CONSTANTS.HEIGHT = window.innerHeight - 85;
	TABLE_CONSTANTS.WIDTH = window.innerWidth - 50;
}

window.addEventListener('load', () => {
	const spg: Spaghetti = new Spaghetti(document.querySelector('main'));
	window.addEventListener('resize', adjustTableConstants);
});
