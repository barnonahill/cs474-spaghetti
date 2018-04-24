import * as React from 'react';
import {
	Button,
	Col,
	ControlLabel,
	Form,
	FormGroup
} from 'react-bootstrap';

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import { Manuscript } from '@src/models/manuscript.ts';
import { MsType } from '@src/models/msType.ts';

interface P {
	country: Country
	library: Library
	manuscript: Manuscript
	msType: MsType
	onBack: () => void
}
interface S {}

export default class ManuscriptEntityPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
	}

	render() {
		return [
			(<Header key="header" min>
				Manuscripts - {this.props.library.libSiglum + ' ' + this.props.manuscript.msSiglum}
			</Header>),
			(<PanelMenu key="panelMenu">
				<Button
					bsStyle="default"
					onClick={this.props.onBack}
				>Back</Button>
			</PanelMenu>),

			(<Form horizontal key="form">
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Country:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.country.country}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Library:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.library.library}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Manuscript Siglum:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.manuscript.msSiglum}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Manuscript Type:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.msType.msTypeName}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Dimensions:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.manuscript.dimensions || 'NULL'}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Leaves:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.manuscript.leaves || 'NULL'}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Foliated:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.manuscript.foliated ? 'Yes' : 'No'}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Vellum:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.manuscript.vellum ? 'Yes' : 'No'}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Binding:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.manuscript.binding || 'NULL'}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Source Notes:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.manuscript.sourceNotes || 'NULL'}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Summary:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.manuscript.summary || 'NULL'}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Bibliography:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.manuscript.bibliography || 'NULL'}
					</Col>
				</FormGroup>
			</Form>)
		];
	}
}
