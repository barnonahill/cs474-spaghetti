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
	TableCellProps
} from 'react-virtualized';

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';
import SearchBar from '@src/components/common/SearchBar.tsx';

import { Provenance } from '@src/models/provenance.ts';
import { TABLE_CONSTANTS } from '@src/index.tsx';

interface P {
	provenances: Provenance[]
	onEdit: (c:Provenance) => void
	onDelete: (c:Provenance) => void
	onRefresh: () => void
	onBack: () => void
}
interface S {
	provenances: Provenance[]
	rowGetter: (i:Index) => Provenance
}

export default class ProvenanceTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			provenances: this.props.provenances,
			rowGetter: (i:Index) => this.state.provenances[i.index],
		};

		this.renderDelete = this.renderDelete.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.filter = this.filter.bind(this);
	}

	render() {
		return [
			<Header min key="header">Provenances</Header>,
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
							placeholder="Filter by countryID and countryName..."
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
				rowCount={this.state.provenances.length}
				rowGetter={this.state.rowGetter}
			>

				<Column
					width={200}
					label="Provenance ID"
					dataKey="provenanceID"
				/>

				<Column
					width={TABLE_CONSTANTS.WIDTH - 330}
					label="Provenance Name"
					dataKey="provenanceName"
				/>

				<Column
					width={60}
					label=""
					dataKey=""
					cellRenderer={this.renderEdit}
				/>

				<Column
					width={60}
					label=""
					dataKey=""
					cellRenderer={this.renderDelete}
				/>
			</Table>)
		];
	}

	renderDelete(p: TableCellProps) {
		const ct:Provenance = p.rowData;
		return (<Button
			bsStyle="danger"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onDelete(ct)}
		>Delete</Button>);
	}

	renderEdit(p: TableCellProps) {
		const ct:Provenance = p.rowData;
		return (<Button
			bsStyle="success"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onEdit(ct)}
		>Edit</Button>);
	}

	filter(v: string) {
		this.setState((s:S) => {
			if (v) {
				s.provenances = this.props.provenances.filter(c => {
					var f = false;
					f = c.provenanceID.toLowerCase().indexOf(v) !== -1;

					if (!f && c.provenanceName) {
							f = c.provenanceName.toLowerCase().indexOf(v) !== -1;
					}
					return f;
				});
			}
			else {
				s.provenances = this.props.provenances;
			}
			return s;
		});
	}
}
