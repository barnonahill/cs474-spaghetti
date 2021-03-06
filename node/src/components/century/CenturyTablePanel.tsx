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

import { Century } from '@src/models/century.ts';
import { TABLE_CONSTANTS } from '@src/index.tsx';

interface P {
	centuries: Century[]
	onEdit: (c:Century) => void
	onDelete: (c:Century) => void
	onRefresh: () => void
	onBack: () => void
}
interface S {
	centuries: Century[]
	rowGetter: (i:Index) => Century
}

export default class CenturyTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			centuries: this.props.centuries,
			rowGetter: (i:Index) => this.state.centuries[i.index],
		};

		this.renderDelete = this.renderDelete.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.filter = this.filter.bind(this);
	}

	render() {
		return [
			<Header min key="header">Centuries</Header>,
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
							placeholder="Filter by centuryID and centuryName..."
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
				rowCount={this.state.centuries.length}
				rowGetter={this.state.rowGetter}
			>

				<Column
					width={200}
					label="Century ID"
					dataKey="centuryID"
				/>

				<Column
					width={TABLE_CONSTANTS.WIDTH - 330}
					label="Century Name"
					dataKey="centuryName"
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
		const ct:Century = p.rowData;
		return (<Button
			bsStyle="danger"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onDelete(ct)}
		>Delete</Button>);
	}

	renderEdit(p: TableCellProps) {
		const ct:Century = p.rowData;
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
				s.centuries = this.props.centuries.filter(c => {
					var f = false;
					f = c.centuryID.toLowerCase().indexOf(v) !== -1;

					if (!f && c.centuryName) {
							f = c.centuryName.toLowerCase().indexOf(v) !== -1;
					}
					return f;
				});
			}
			else {
				s.centuries = this.props.centuries;
			}
			return s;
		});
	}
}
