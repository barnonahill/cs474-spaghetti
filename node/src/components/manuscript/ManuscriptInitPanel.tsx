import * as React from 'react';
import {
	Button,
	Col,
	Row
} from 'react-bootstrap';

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';

import { Panel } from '@src/components/manuscript/ManuscriptApp.tsx';

interface P {
	onBack: () => void
	onSelect: (p:Panel) => void
}

export default class ManuscriptInitPanel extends React.Component<P,{}> {
	constructor(p:P) {
		super(p);
	}

	render() {
		return [
			<Header key="header" min>Manuscripts</Header>,
			(<PanelMenu key="panelMenu">
				<Button
					bsStyle="default"
					onClick={this.props.onBack}
				>Back</Button>
			</PanelMenu>),
			(<Row key="row">
				<Col xs={12} sm={6}>
					<Button
						bsStyle="primary"
						onClick={() => this.props.onSelect(Panel.FILTER)}
					>Filter by Country and Library</Button>
				</Col>
				<Col xs={12} sm={6}>
					<Button
						bsStyle="primary"
						onClick={() => this.props.onSelect(Panel.TABLE)}
					>Load all Manuscripts</Button>
				</Col>
			</Row>)
		];
	}
}
