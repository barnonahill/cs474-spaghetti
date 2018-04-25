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
		var x: JSX.Element[] = [];

		x.push(<Header key="header">Select an Entity Application</Header>);

		x.push(<Row key="apps">
			<Col sm={4}>
				<Button
					bsStyle="info"
					bsSize="large"
					className="mt20 w100p"
					onClick={() => this.props.onSelect(AppEnum.LIB)}
				>Library</Button>
			</Col>

			<Col sm={4}>
				<Button
					bsStyle="info"
					bsSize="large"
					className="mt20 w100p"
					onClick={() => this.props.onSelect(AppEnum.MS)}
				>Manuscript</Button>
			</Col>

			<Col sm={4}>
				<Button
					bsStyle="info"
					bsSize="large"
					className="mt20 w100p"
					//onClick={() => this.props.onSelect(AppEnum.MS)}
				>Section</Button>
			</Col>
		</Row>);

		return x;
	}
}
