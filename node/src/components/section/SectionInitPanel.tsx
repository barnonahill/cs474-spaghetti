import * as React from 'react';
import {
	Button,
	Col,
	Row
} from 'react-bootstrap';

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';

import { Panel } from '@src/components/section/SectionApp.tsx';

interface P {
	onBack: () => void
	onSubmit: (p:Panel) => void
}

export default class SectionInitPanel extends React.Component<P,{}> {
	constructor(p:P) {
		super(p);
	}

	render() {
		return [
			<Header key="header" min>Sections</Header>,
			(<PanelMenu key="panelMenu">
				<Button
					bsStyle="default"
					onClick={this.props.onBack}
				>Back</Button>
			</PanelMenu>),

			(<Row key="actions" className="mb30">
				<Col xs={12} sm={4} smOffset={1}>
					<Button
						bsStyle="primary"
						bsSize="large"
						className="w100p"
						onClick={() => this.props.onSubmit(Panel.FILTER)}
					>Filter Sections</Button>
				</Col>
				<Col xs={12} sm={4} smOffset={2}>
					<Button
						bsStyle="primary"
						bsSize="large"
						className="w100p"
						onClick={() => this.props.onSubmit(Panel.TABLE)}
					>Load all Sections</Button>
				</Col>
			</Row>),
		];
	}
}
