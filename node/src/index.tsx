import * as React from 'react';
import * as ReactDOM from 'react-dom';

import LibraryPage from '@src/components/library/LibraryPage.tsx';

import { Country } from '@src/models/country.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

class App {
	private stack: Array<any>;
	private pageContainer: HTMLElement;

	constructor(private container: HTMLElement) {
		this.stack = [];
		this.pageContainer = document.getElementById('page');
	}

	renderLibrary() {
		proxyFactory.getLibraryProxy().getCountries((countries:Array<Country>, e?:string) => {
			if (e) {
				alert(e);
				return;
			}

			ReactDOM.render(
				(<LibraryPage
					stack={this.stack}
					countries={countries}
				/>),
				this.pageContainer
			);
		});
	}
}

const app: App = new App((document.getElementById('app')));
app.renderLibrary();
