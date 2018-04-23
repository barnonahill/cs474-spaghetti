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

interface P {
	country: Country
	library: Library
	manuscripts: Array<Manuscript>
	onBack: () => void
	onRefresh: () => void
	onEdit: (ms:Manuscript) => void
	onDelete: (ms:Manuscript) => void
}
interface S {
	rowGetter: (i:Index) => Manuscript
	manuscripts: Array<Manuscript>
	height: number
	width: number
}

export default class ManuscriptTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			rowGetter: (i:Index) => this.state.manuscripts[i.index],
			manuscripts: this.props.manuscripts,
			height: window.innerHeight * 0.95,
			width: window.innerWidth - 50
		};

		this.getHeader = this.getHeader.bind(this);
		this.renderView = this.renderView.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderDelete = this.renderDelete.bind(this);
		this.filter = this.filter.bind(this);
	}

	getHeader() {
		var h = 'Manuscripts';
		if (this.props.country) {
			if (this.props.library) {
				h += ' - ' + this.props.library.library + ', ' + this.props.country.country;
			}
			else {
				h += ' - ' + this.props.country.country;
			}
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
							placeholder="Filter by libSiglum, msSiglum, and msType..."
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
				className="mb10"
				rowClassName="tr"
				rowGetter={this.state.rowGetter}
				height={this.state.height}
				width={this.state.width}
				headerHeight={40}
				rowHeight={50}
				rowCount={this.state.manuscripts.length}
			>

				<Column
					label="Lib Siglum"
					dataKey="libSiglum"
					width={100}
				/>

				<Column
					label="MS Siglum"
					dataKey="msSiglum"
					width={this.state.width - 480}
				/>

				<Column
					label="Type"
					dataKey="msType"
					width={200}
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

	renderView(p:TableCellProps) {
		var ms: Manuscript = p.rowData;
		return (<Button
			bsStyle="info"
			bsSize="small"
			className="w100p"
		>View</Button>);
	}

	renderEdit(p:TableCellProps) {
		var ms: Manuscript = p.rowData;
		return (<Button
			bsStyle="success"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onEdit(ms)}
		>Edit</Button>);
	}

	renderDelete(p:TableCellProps) {
		var ms: Manuscript = p.rowData;
		return (<Button
			bsStyle="danger"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onDelete(ms)}
		>Delete</Button>);
	}

	filter(v:string) {
		this.setState((s:S) => {
			if (v) {
				s.manuscripts = this.props.manuscripts.filter((m:Manuscript) => {
					return m.libSiglum.toLowerCase().indexOf(v) !== -1 ||
						m.msType.toLowerCase().indexOf(v) !== -1 ||
						m.msSiglum.toLowerCase().indexOf(v) !== -1;
				});
			}
			else {
				s.manuscripts = this.props.manuscripts;
			}
			return s;
		});
	}
}
