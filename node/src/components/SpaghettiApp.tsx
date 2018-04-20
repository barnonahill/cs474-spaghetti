import * as React from 'react';

import Header from '@src/components/common/Header.tsx';

import { Country } from '@src/models/country.ts';

export enum App {
	INIT=0, // this
	LIB=1
}

interface P {
	onSelect: (a:App) => void
}
interface S {
}

export default class SpaghettiApp extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
	}

	render() {
		return [
			<Header key="header">Select a page to load</Header>,
			(<div key="pages">
				<a onClick={() => this.props.onSelect(App.LIB)}>Library</a>
			</div>)
		];
	}
}
