import * as React from 'react';
import {
	Button,
	Col,
	Row
} from 'react-bootstrap';
import {
	Column,
	Index,
	Table,
	TableCellProps,
} from 'react-virtualized';
import 'react-virtualized/styles.css'

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';
import SearchBar from '@src/components/common/SearchBar.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import { Manuscript } from '@src/models/manuscript.ts';
import { Section } from '@src/models/section.ts';
import { TABLE_CONSTANTS } from '@src/index.tsx';

interface P {
	library?: Library
	manuscript?: Manuscript
	sections: Section[]
	onBack: () => void
	onRefresh: () => void
	onEdit: (s:Section) => void
	onDelete: (s:Section) => void
	onView: (s:Section) => void
}
interface S {
	rowGetter: (i:Index) => Section
	sections: Section[]
}

export default class SectionTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			rowGetter: (i:Index) => this.state.sections[i.index],
			sections: this.props.sections,
		};

		this.getHeader = this.getHeader.bind(this);
		this.refreshSections = this.refreshSections.bind(this);

		this.renderView = this.renderView.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderDelete = this.renderDelete.bind(this);
		this.filter = this.filter.bind(this);
	}

	getHeader() {
		var h = 'Sections';
		if (this.props.manuscript) {
			h += ': ' + this.props.manuscript.msSiglum + ', ' + this.props.library.library;
		}
		return h;
	}

	render() {
		return [
			<Header key="header" min>{this.getHeader()}</Header>,
			(<PanelMenu key="panelMenu">
				<Row>
					<Col sm={4}>
						<Button
							bsStyle="default"
							onClick={this.props.onBack}
						>Back</Button>
						<Button
							bsStyle="success"
							onClick={() => this.props.onEdit(null)}
							className="ml15"
						>New</Button>
					</Col>
					<Col sm={4}>
						<SearchBar
							placeholder="Filter by libSiglum, msSiglum, and sectionID..."
							onSubmit={this.filter}
						/>
					</Col>
					<Col sm={2} smOffset={2}>
						<Button
							bsStyle="primary"
							className="fr"
							onClick={this.props.onRefresh}
						>Refresh</Button>
					</Col>
				</Row>
			</PanelMenu>),

			(<Table key="table"
				className={TABLE_CONSTANTS.CLASS}
				rowClassName={TABLE_CONSTANTS.ROW_CLASS}
				height={TABLE_CONSTANTS.HEIGHT}
				width={TABLE_CONSTANTS.WIDTH}
				headerHeight={TABLE_CONSTANTS.HEADER_HEIGHT}
				rowHeight={TABLE_CONSTANTS.ROW_HEIGHT}
				rowCount={this.state.sections.length}
				rowGetter={this.state.rowGetter}
			>

				<Column
					label="Lib Siglum"
					dataKey="libSiglum"
					width={100}
				/>

				<Column
					label="MS Siglum"
					dataKey="msSiglum"
					width={TABLE_CONSTANTS.WIDTH - 380}
				/>

				<Column
					label="Section ID"
					dataKey="sectionID"
					width={100}
				/>

				<Column
					dataKey=""
					width={60}
					cellRenderer={this.renderView}
				/>

				<Column
					dataKey=""
					width={60}
					cellRenderer={this.renderEdit}
				/>

				<Column
					dataKey=""
					width={60}
					cellRenderer={this.renderDelete}
				/>
			</Table>)
		];
	}

	refreshSections(ss: Section[]) {
		this.setState((s:S) => {
			s.sections = ss;
			return s;
		});
	}

	renderEdit(p:TableCellProps) {
		var s: Section = p.rowData;
		return (<Button
			bsStyle="success"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onEdit(s)}
		>Edit</Button>);
	}

	renderDelete(p:TableCellProps) {
		var s: Section = p.rowData;
		return (<Button
			bsStyle="danger"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onDelete(s)}
		>Delete</Button>);
	}

	renderView(p:TableCellProps) {
		var s: Section = p.rowData;
		return (<Button
			bsStyle="info"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onView(s)}
		>View</Button>);
	}

	filter(v:string) {
		this.setState((s:S) => {
			if (v) {
				s.sections = this.props.sections.filter(s => {
					return s.libSiglum.toLowerCase().indexOf(v) !== -1 ||
						s.sectionID.toString().toLowerCase().indexOf(v) !== -1 ||
						s.msSiglum.toLowerCase().indexOf(v) !== -1;
				});
			}
			else {
				s.sections = this.props.sections;
			}
			return s;
		});
	}
}
