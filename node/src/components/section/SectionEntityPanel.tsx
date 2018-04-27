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

// Main entities
import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import { Manuscript } from '@src/models/manuscript.ts';
import { Section } from '@src/models/section.ts';

// Support Entities
import { Century } from '@src/models/century.ts';
import { Cursus } from '@src/models/cursus.ts';
import { MsType } from '@src/models/msType.ts';
import { Notation } from '@src/models/notation.ts';
import { Provenance } from '@src/models/provenance.ts';
import { SourceCompleteness } from '@src/models/sourceCompleteness.ts';

import
	SectionApp,
	{ Panel as StnPanelEnum }
from '@src/components/section/SectionApp.tsx';

enum Panel {
	ENT=0,
	STN=1
}

interface P {
	entities: {
		country: Country
		library: Library
		manuscript: Manuscript
		section: Section

		century?: Century
		cursus?: Cursus
		provenance?: Provenance
		notation?: Notation
		sectionType?: MsType
		sourceComp: SourceCompleteness

		// TODO Needed if we're opening leaves
		// countries: Country[]
		// libraries: Library[] // if we don't have these SectionApp will get them.
		// manuscripts: Manuscript[]
		// sections: Section[]
		// msTypes: MsType[]
	}

	onBack: () => void
}
interface S {
	panel: Panel
}

export default class SectionEntityPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.ENT
		};

		this.out = this.out.bind(this);
		this.renderEntity = this.renderEntity.bind(this);
		// this.renderSectionTable = this.renderSectionTable.bind(this);
	}

	/**
	 * Formats attributes for output.
	 * @param a The attribute
	 * @return The attribute or the string 'NULL'.
	 */
	private out(a:string|number) {
		return a || 'NULL';
	}

	/**
	 * Creates the JSX Element for a SectionEntityPanel.
	 */
	public render() {
		switch (this.state.panel) {
			default:
			case Panel.ENT:
				return this.renderEntity();

			// case Panel.STN:
			// 	return this.renderSectionTable();
		}
	}

	/**
	 * Creates the JSX ELement for the entity view.
	 */
	private renderEntity() {
		return [
			(<Header key="header" min>
				Section #{this.props.entities.section.sectionID} of Manuscript {this.props.entities.section.msSiglum} from Library l {this.props.entities.library.library}
			</Header>),
			(<PanelMenu key="panelMenu">
				<Button
					bsStyle="default"
					onClick={this.props.onBack}
				>Back</Button>
				{// TODO turn this into Leaves.
					/* <Button
					bsStyle="info"
					className="fr"
					onClick={() => this.changePanel(Panel.STN)}
				>Sections</Button> */}
			</PanelMenu>),

			(<Form horizontal key="form">
				{/* Primary keys */}
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Country:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.entities.country.country}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Library:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.entities.library.library}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Manuscript Siglum:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.entities.manuscript.msSiglum}
					</Col>
				</FormGroup>
				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Section Number:
					</Col>
					<Col sm={4} className="pt7">
						{this.props.entities.section.sectionID}
					</Col>
				</FormGroup>

				{/* Optional keys */}

				{/* century?: Century
				cursus?: Cursus
				provenance?: Provenance
				notation?: Notation
				sectionType?: MsType
				sourceComp: SourceCompleteness */}

				<FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Section Type:
          </Col>
          <Col sm={4} className="pt7">
            {this.out(this.props.entities.sectionType.msTypeName)}
          </Col>
        </FormGroup>

				<FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Notation:
          </Col>
          <Col sm={4} className="pt7">
            {this.out(this.props.entities.notation.notationName)}
          </Col>
        </FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Century:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.century.centuryName)}
					</Col>
				</FormGroup>

				<FormGroup>
          <Col sm={3} componentClass={ControlLabel}>
            Date:
          </Col>
          <Col sm={4} className="pt7">
            {this.out(this.props.entities.section.date)}
          </Col>
        </FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Cursus:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.cursus.cursusName)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Provenance:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.provenance.provenanceID)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Provenance Details:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.section.provenanceDetail)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Source Completeness:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.sourceComp.sourceCompletenessName)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Scribe:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.section.scribe)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Commissioner:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.section.commissioner)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Number of Gatherings:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.section.numGatherings)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Number of Columns:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.section.numColumns)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Number of Lines per Column:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.section.linesPerColumn)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Inscription:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.section.inscription)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Colophon:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.section.colophon)}
					</Col>
				</FormGroup>

				<FormGroup>
					<Col sm={3} componentClass={ControlLabel}>
						Commissioner:
					</Col>
					<Col sm={4} className="pt7">
						{this.out(this.props.entities.section.commissioner)}
					</Col>
				</FormGroup>
			</Form>)
		];
	}

	// TODO turn this into Leaves.
	// renderSectionTable() {
	// 	return (<SectionApp
	// 		countries={this.props.countries}
	// 		onBack={() => this.changePanel(Panel.ENT)}
	//
	// 		sideloads = {{
	// 			country: this.props.country,
	// 			library: this.props.library,
	// 			manuscript: this.props.manuscript,
	// 			libraries: this.props.libraries,
	// 			manuscripts: this.props.manuscripts.filter(m => m.libSiglum === this.props.library.libSiglum),
	// 			msTypes: this.props.msTypes
	// 		}}
	// 	/>);
	// }

	private changePanel(p:Panel) {
		this.setState((s:S) => {
			s.panel = p;
			return s;
		});
	}
}
