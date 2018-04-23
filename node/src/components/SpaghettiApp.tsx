import * as React from 'react';
import {
	Button
} from 'react-bootstrap';

import Header from '@src/components/common/Header.tsx';

import { App } from '@src/index.tsx';

import { Country } from '@src/models/country.ts';

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
			(<div key="apps" className="apps">
				<Button
					bsStyle="primary"
					className="mt20 db"
					onClick={() => this.props.onSelect(App.LIB)}
				>Library</Button>
				<Button
					bsStyle="primary"
					className="mt20 db"
					onClick={() => this.props.onSelect(App.MS)}
				>Manuscript</Button>
			</div>)
		];
	}
}
