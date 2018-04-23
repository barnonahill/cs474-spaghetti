import * as React from 'react';
import {
	Button,
	Col,
	Row
} from 'react-bootstrap';

import Header from '@src/components/common/Header.tsx';

import { App as AppEnum } from '@src/index.tsx';

import { Country } from '@src/models/country.ts';

interface P {
	onSelect: (a:AppEnum) => void
}
interface S {
}

export default class SpaghettiApp extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
	}

	render() {
		return [
			<Header key="header">Select an Entity Application</Header>,
			(<Row key="apps" className="apps">
				<Col sm={3}>
					<Button
						bsStyle="info"
						bsSize="large"
						className="mt20 w100p"
						onClick={() => this.props.onSelect(AppEnum.LIB)}
					>Library</Button>
				</Col>
				<Col sm={3}>
					<Button
						bsStyle="info"
						bsSize="large"
						className="mt20 w100p"
						onClick={() => this.props.onSelect(AppEnum.MS)}
					>Manuscript</Button>
				</Col>
			</Row>)
		];
	}
}
