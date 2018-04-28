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

import { Notation } from '@src/models/notation.ts';
import { TABLE_CONSTANTS } from '@src/index.tsx';

interface P {
	notations: Notation[]
	onEdit: (c:Notation) => void
	onDelete: (c:Notation) => void
	onRefresh: () => void
	onBack: () => void
}
interface S {
	notations: Notation[]
	rowGetter: (i:Index) => Notation
}

export default class NotationTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			notations: this.props.notations,
			rowGetter: (i:Index) => this.state.notations[i.index],
		};

		this.renderDelete = this.renderDelete.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.filter = this.filter.bind(this);
	}

	render() {
		return [
			<Header min key="header">Notations</Header>,
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
							onSubmit={this.filter}
							placeholder="Filter by notationID and notationName..."
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
				rowCount={this.state.notations.length}
				rowGetter={this.state.rowGetter}
			>

				<Column
					width={200}
					label="Notation ID"
					dataKey="notationID"
				/>

				<Column
					width={TABLE_CONSTANTS.WIDTH - 330}
					label="Notation Name"
					dataKey="notationName"
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
		const ct:Notation = p.rowData;
		return (<Button
			bsStyle="danger"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onDelete(ct)}
		>Delete</Button>);
	}

	renderEdit(p: TableCellProps) {
		const ct:Notation = p.rowData;
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
				s.notations = this.props.notations.filter(c => {
					var f = false;
					f = c.notationID.toLowerCase().indexOf(v) !== -1;

					if (!f && c.notationName) {
							f = c.notationName.toLowerCase().indexOf(v) !== -1;
					}
					return f;
				});
			}
			else {
				s.notations = this.props.notations;
			}
			return s;
		});
	}
}
