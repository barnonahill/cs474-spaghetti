import * as React from 'react';
import {
	Button
} from 'react-bootstrap';
import {
	Column,
	Index,
	Table,
	TableCellProps
} from 'react-virtualized';

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';

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
	rowGetter: (i:Index) => Century
}

export default class MsTypeTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			rowGetter: (i:Index) => this.props.centuries[i.index],
		};

		this.renderDelete = this.renderDelete.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
	}

	render() {
		return [
			<Header min key="header">Manuscript Types</Header>,
			(<PanelMenu key="panelMenu">
				<Button
					bsStyle="default"
					onClick={this.props.onBack}
				>Back</Button>
				<Button
					bsStyle="success"
					className="ml15"
					onClick={() => this.props.onEdit(null)}
				>New</Button>
				<Button
					bsStyle="primary"
					className="fr"
					onClick={this.props.onRefresh}
				>Refresh</Button>
			</PanelMenu>),

			(<Table key="table"
				className={TABLE_CONSTANTS.CLASS}
				rowClassName={TABLE_CONSTANTS.ROW_CLASS}
				height={TABLE_CONSTANTS.HEIGHT}
				width={TABLE_CONSTANTS.WIDTH}
				headerHeight={TABLE_CONSTANTS.HEADER_HEIGHT}
				rowHeight={TABLE_CONSTANTS.ROW_HEIGHT}
				rowCount={this.props.centuries.length}
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
}
