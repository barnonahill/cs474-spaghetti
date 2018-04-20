import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
	default as InitApp,
	App as AppEnum
} from '@src/components/SpaghettiApp.tsx';
import Header from '@src/components/common/Header.tsx';
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
		this.onSelect = this.onSelect.bind(this);
	}

	onSelect(a:AppEnum) {
		switch (a) {
			case AppEnum.INIT:
			default:
				this.renderInitApp();
				break;
			case AppEnum.LIB:
				this.renderLibraryApp();
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
		proxyFactory.getLibraryProxy().getCountries((countries:Array<Country>, e?:string) => {
			if (e) {
				alert(e);
				return;
			}

			ReactDOM.render(
				(<LibraryApp
					stack={this.stack}
					countries={countries}
					onBack={() => this.onSelect(AppEnum.INIT)}
				/>),
				this.appContainer
			);
		});
	}
}

const spg: Spaghetti = new Spaghetti(document.querySelector('main'));
spg.renderInitApp();
