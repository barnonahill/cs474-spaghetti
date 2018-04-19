import * as React from 'react';
import * as ReactDOM from 'react-dom';

import LibraryApp from '@src/components/library/LibraryApp.tsx';

import { Country } from '@src/models/country.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

/**
 * Spaghetti is our React Application, composed of a subset of Entity Applications.
 */
class Spaghetti {
	private stack: Array<any>;
	private appContainer: HTMLElement;

	constructor(private container: HTMLElement) {
		this.stack = [];
		this.appContainer = container.getElementsByTagName('section')[0];
	}

	renderLibraryApp() {
		proxyFactory.getLibraryProxy().getCountries((countries:Array<Country>, e?:string) => {
			if (e) {
				alert(e);
				return;
			}

			ReactDOM.render(
				(<LibraryApp
					stack={this.stack}
					countries={countries}
				/>),
				this.appContainer
			);
		});
	}
}

const spg: Spaghetti = new Spaghetti(document.querySelector('main'));
spg.renderLibraryApp();
