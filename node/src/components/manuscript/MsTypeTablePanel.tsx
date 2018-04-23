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

import { MsType } from '@src/models/msType.ts';

interface P {
	msTypes: Array<MsType>
	onEdit: (mst:MsType) => void
	onDelete: (mst:MsType) => void
	onRefresh: () => void
	onBack: () => void
}
interface S {
	rowGetter: (i:Index) => MsType
	width: number
}

export default class MsTypeTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			rowGetter: (i:Index) => this.props.msTypes[i.index],
			width: window.innerWidth - 50
		};

		this.renderEdit = this.renderEdit.bind(this);
		this.renderDelete = this.renderDelete.bind(this);
	}

	renderEdit(p: TableCellProps) {
		const mst:MsType = p.rowData;
		return (<Button
			bsStyle="success"
			bsSize="small"
			onClick={() => this.props.onEdit(mst)}
		>Edit</Button>);
	}

	renderDelete(p: TableCellProps) {
		const mst:MsType = p.rowData;
		return (<Button
			bsStyle="danger"
			bsSize="small"
			onClick={() => this.props.onDelete(mst)}
		>Delete</Button>);
	}

	render() {
		return [
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
				rowClassName="tr"
				height={window.innerHeight}
				width={this.state.width}
				headerHeight={40}
				rowHeight={50}
				rowCount={this.props.msTypes.length}
				rowGetter={this.state.rowGetter}
			>

				<Column
					width={200}
					label="Manuscript Type"
					dataKey="msType"
				/>

				<Column
					width={this.state.width - 330}
					label="Name"
					dataKey="msTypeName"
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
}
