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

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';
import SearchBar from '@src/components/common/SearchBar.tsx';

import { MsType } from '@src/models/msType.ts';
import { TABLE_CONSTANTS } from '@src/index.tsx';

interface P {
	msTypes: MsType[]
	onEdit: (mst:MsType) => void
	onDelete: (mst:MsType) => void
	onRefresh: () => void
	onBack: () => void
}
interface S {
	msTypes: MsType[]
	rowGetter: (i:Index) => MsType
}

export default class MsTypeTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			msTypes: p.msTypes,
			rowGetter: (i:Index) => this.state.msTypes[i.index]
		};

		this.renderDelete = this.renderDelete.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.filter = this.filter.bind(this);
	}

	render() {
		return [
			<Header min key="header">Manuscript Types</Header>,
			(<PanelMenu key="panelMenu">
				<Row>
					<Col sm={4}>
						<Button
							bsStyle="default"
							onClick={this.props.onBack}
						>Back</Button>
						<Button
							bsStyle="success"
							className="ml15"
							onClick={() => this.props.onEdit(null)}
						>New</Button>
					</Col>

					<Col sm={4}>
						<SearchBar
							placeholder="Filter by msType and msTypeName..."
							onSubmit={this.filter}
						/>
					</Col>

					<Col smOffset={2} sm={2}>
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
				rowCount={this.state.msTypes.length}
				rowGetter={this.state.rowGetter}>

				<Column
					width={200}
					label="Manuscript Type"
					dataKey="msType"
				/>

				<Column
					width={TABLE_CONSTANTS.WIDTH - 330}
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

	renderDelete(p: TableCellProps) {
		const mst:MsType = p.rowData;
		return (<Button
			bsStyle="danger"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onDelete(mst)}
		>Delete</Button>);
	}

	renderEdit(p: TableCellProps) {
		const mst:MsType = p.rowData;
		return (<Button
			bsStyle="success"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onEdit(mst)}
		>Edit</Button>);
	}

	filter(v: string) {
		this.setState((s:S) => {
			if (v) {
				s.msTypes = this.props.msTypes.filter(mst => {
					return (mst.msType.toLowerCase().indexOf(v) !== -1 ||
						mst.msTypeName.toLowerCase().indexOf(v) !== -1);
				});
			}
			else {
				s.msTypes = this.props.msTypes;
			}
			return s;
		});
	}
}
