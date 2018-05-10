import * as React from 'react';
import {
	Button,
	Col,
	Row
 } from 'react-bootstrap';
import {
	Table,
	Column,
	TableCellProps,
	Index
} from 'react-virtualized';
import 'react-virtualized/styles.css'

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';
import SearchBar from '@src/components/common/SearchBar.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import { TABLE_CONSTANTS } from '@src/index.tsx';

export enum ButtonType {
	VIEW=0,
	EDIT=1,
	DEL=2
}

interface Properties {
	country: Country
	libraries: Array<Library>
	onView: (l:Library) => void
	onEdit: (l:Library) => void
	onDelete: (l:Library) => void
	onRefresh: () => void
	onBack: () => void
}

interface State {
	rowGetter: (i:Index) => Library
	libraries: Array<Library>
}

export default class LibraryTablePanel extends React.Component<Properties, State> {
	constructor(props: Properties) {
		super(props);

		this.state = {
			rowGetter: (i:Index) => this.state.libraries[i.index],
			libraries: this.props.libraries,
		};

		this.filter = this.filter.bind(this);
		this.renderView = this.renderView.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderDelete = this.renderDelete.bind(this);
	}

	render() {
		return [
			<Header key="header" min>Libraries - {this.props.country.country}</Header>,
			(<PanelMenu key="panelMenu">
				<Row>
					<Col sm={4}>
						<Button key="back"
							bsStyle="default"
							onClick={this.props.onBack}
						>Back</Button>
						<Button key="new"
							bsStyle="success"
							onClick={() => this.props.onEdit(null)}
							className="ml15"
						>New</Button>
					</Col>
					<Col sm={4}>
						<SearchBar
							placeholder="Filter by name, city, and siglum..."
							onSubmit={this.filter}
						/>
					</Col>
					<Col sm={2} smOffset={2}>
						<Button key="refresh"
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
				rowCount={this.state.libraries.length}
				rowGetter={this.state.rowGetter}>
				<Column
					label="Siglum"
					dataKey="libSiglum"
					width={100}
				/>
				<Column
					label="Name"
					dataKey="library"
					// sigWidth(100) + cityWidth(200) + buttonsWidth(60*3) = 480
					width={TABLE_CONSTANTS.WIDTH - 480}
				/>
				<Column
					label="City"
					dataKey="city"
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

	filter(v: string) {
		this.setState((s:State) => {
			if (v) {
				s.libraries = this.props.libraries.filter((l:Library) => {
					return l.libSiglum.toLowerCase().indexOf(v) !== -1 ||
						l.library.toLowerCase().indexOf(v) !== -1 ||
						l.city.toLowerCase().indexOf(v) !== -1;
				});
			}
			else {
				s.libraries = this.props.libraries;
			}
			return s;
		});
	}

	renderDelete(props: TableCellProps) {
		const l: Library = props.rowData;
		const t = ButtonType.DEL;
		return <Button
			bsStyle="danger"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onDelete(l)}
			>Delete
		</Button>;
	}

	renderEdit(props: TableCellProps) {
		const l: Library = props.rowData;
		const t = ButtonType.EDIT;
		return <Button
			bsStyle="success"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onEdit(l)}
			>Edit
		</Button>;
	}

	renderView(props: TableCellProps) {
		const l: Library = props.rowData;
		const t = ButtonType.VIEW;
		// props.rowData: Library
		return <Button
			bsStyle="info"
			bsSize="small"
			className="w100p"
			onClick={() => this.props.onView(l)}
			>View
		</Button>;
	}
}
