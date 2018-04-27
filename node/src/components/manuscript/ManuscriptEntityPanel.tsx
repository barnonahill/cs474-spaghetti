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
import
	SectionApp,
	{ Panel as StnPanelEnum }
from '@src/components/section/SectionApp.tsx';

enum Panel {
	ENT=0,
	STN=1
}

interface P {
	// Needed if we're opening sections
	countries: Country[]
	libraries: Library[] // if we don't have these SectionApp will get them.
	manuscripts: Manuscript[]
	msTypes: MsType[]

	country: Country
	library: Library
	manuscript: Manuscript
	msType: MsType
	onBack: () => void
}
interface S {
	panel: Panel
}

export default class ManuscriptEntityPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.ENT
		};

		this.renderEntity = this.renderEntity.bind(this);
		this.renderSectionTable = this.renderSectionTable.bind(this);
	}

	render() {
		switch (this.state.panel) {
			default:
			case Panel.ENT:
				return this.renderEntity();

			case Panel.STN:
				return this.renderSectionTable();
		}
	}

	renderEntity() {
		return [
			(<Header key="header" min>
				Manuscripts - {this.props.library.libSiglum + ' ' + this.props.manuscript.msSiglum}
			</Header>),
			(<PanelMenu key="panelMenu">
				<Button
					bsStyle="default"
					onClick={this.props.onBack}
				>Back</Button>
				<Button
					bsStyle="info"
					className="fr"
					onClick={() => this.changePanel(Panel.STN)}
				>View Sections</Button>
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
						{typeof this.props.manuscript.leaves === 'number' ? this.props.manuscript.leaves : 'NULL'}
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

	renderSectionTable() {
		return (<SectionApp
			countries={this.props.countries}
			onBack={() => this.changePanel(Panel.ENT)}

			sideloads = {{
				country: this.props.country,
				library: this.props.library,
				manuscript: this.props.manuscript,
				libraries: this.props.libraries,
				manuscripts: this.props.manuscripts.filter(m => m.libSiglum === this.props.library.libSiglum),
				msTypes: this.props.msTypes
			}}
		/>);
	}

	changePanel(p:Panel) {
		this.setState((s:S) => {
			s.panel = p;
			return s;
		});
	}
}
