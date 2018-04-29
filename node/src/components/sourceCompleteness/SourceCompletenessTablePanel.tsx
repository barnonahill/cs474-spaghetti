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

import { SourceCompleteness } from '@src/models/sourceCompleteness.ts';
import { TABLE_CONSTANTS } from '@src/index.tsx';

interface P {
	sourceCompletenesses: SourceCompleteness[]
	onEdit: (c:SourceCompleteness) => void
	onDelete: (c:SourceCompleteness) => void
	onRefresh: () => void
	onBack: () => void
}
interface S {
	sourceCompletenesses: SourceCompleteness[]
	rowGetter: (i:Index) => SourceCompleteness
}

export default class SourceCompletenessTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			sourceCompletenesses: this.props.sourceCompletenesses,
			rowGetter: (i:Index) => this.state.sourceCompletenesses[i.index],
		};

		this.renderDelete = this.renderDelete.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.filter = this.filter.bind(this);
	}

	render() {
		return [
			<Header min key="header">Source Completenesses</Header>,
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
							placeholder="Filter by scID and scName..."
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
				rowCount={this.state.sourceCompletenesses.length}
				rowGetter={this.state.rowGetter}
			>

				<Column
					width={200}
					label="SC ID"
					dataKey="sourceCompletenessID"
				/>

				<Column
					width={TABLE_CONSTANTS.WIDTH - 330}
					label="SC Name"
					dataKey="sourceCompletenessName"
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
		const ct:SourceCompleteness = p.rowData;
		return (<Button
			bsStyle="danger"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onDelete(ct)}
		>Delete</Button>);
	}

	renderEdit(p: TableCellProps) {
		const ct:SourceCompleteness = p.rowData;
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
				s.sourceCompletenesses = this.props.sourceCompletenesses.filter(c => {
					var f = false;
					f = c.sourceCompletenessID.toLowerCase().indexOf(v) !== -1;

					if (!f && c.sourceCompletenessName) {
							f = c.sourceCompletenessName.toLowerCase().indexOf(v) !== -1;
					}
					return f;
				});
			}
			else {
				s.sourceCompletenesses = this.props.sourceCompletenesses;
			}
			return s;
		});
	}
}
