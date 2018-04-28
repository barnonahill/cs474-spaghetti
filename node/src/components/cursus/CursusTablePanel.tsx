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

import { Cursus } from '@src/models/cursus.ts';
import { TABLE_CONSTANTS } from '@src/index.tsx';

interface P {
	cursuses: Cursus[]
	onEdit: (c:Cursus) => void
	onDelete: (c:Cursus) => void
	onRefresh: () => void
	onBack: () => void
}
interface S {
	cursuses: Cursus[]
	rowGetter: (i:Index) => Cursus
}

export default class CursusTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			cursuses: this.props.cursuses,
			rowGetter: (i:Index) => this.state.cursuses[i.index],
		};

		this.renderDelete = this.renderDelete.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.filter = this.filter.bind(this);
	}

	render() {
		return [
			<Header min key="header">Cursuses</Header>,
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
				rowCount={this.state.cursuses.length}
				rowGetter={this.state.rowGetter}
			>

				<Column
					width={200}
					label="Cursus ID"
					dataKey="cursusID"
				/>

				<Column
					width={TABLE_CONSTANTS.WIDTH - 330}
					label="Cursus Name"
					dataKey="cursusName"
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
		const ct:Cursus = p.rowData;
		return (<Button
			bsStyle="danger"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onDelete(ct)}
		>Delete</Button>);
	}

	renderEdit(p: TableCellProps) {
		const ct:Cursus = p.rowData;
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
				s.cursuses = this.props.cursuses.filter(c => {
					var f = false;
					f = c.cursusID.toLowerCase().indexOf(v) !== -1;

					if (!f && c.cursusName) {
							f = c.cursusName.toLowerCase().indexOf(v) !== -1;
					}
					return f;
				});
			}
			else {
				s.cursuses = this.props.cursuses;
			}
			return s;
		});
	}
}
