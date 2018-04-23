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

import PanelMenu from '@src/components/common/PanelMenu.tsx';
import SearchBar from '@src/components/common/SearchBar.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';

enum DataKey {
	LIBRARY = 'library',
	CITY = 'city',
	VIEW = 'view',
	EDIT = 'edit',
	DELETE = 'delete'
}

export enum ButtonType {
	VIEW=0,
	EDIT=1,
	DEL=2
}

interface Properties {
	country: Country
	libraries: Array<Library>
	onClick: (l:Library,t:ButtonType) => void
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
			libraries: this.props.libraries
		};

		this.filter = this.filter.bind(this);
		this.viewBtnRenderer = this.viewBtnRenderer.bind(this);
		this.editBtnRenderer = this.editBtnRenderer.bind(this);
		this.deleteBtnRenderer = this.deleteBtnRenderer.bind(this);
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

	viewBtnRenderer(props: TableCellProps) {
		const l: Library = props.rowData;
		const t = ButtonType.VIEW;
		// props.rowData: Library
		return <Button
			bsStyle="info"
			bsSize="small"
			key={l.libSiglum + t}
			onClick={this.props.onClick.bind(this,l,t)}
			>View
		</Button>;
	}

	editBtnRenderer(props: TableCellProps) {
		const l: Library = props.rowData;
		const t = ButtonType.EDIT;
		return <Button
			bsStyle="success"
			bsSize="small"
			key={l.libSiglum + t}
			onClick={this.props.onClick.bind(this,l,t)}
			>Edit
		</Button>;
	}

	deleteBtnRenderer(props: TableCellProps) {
		const l: Library = props.rowData;
		const t = ButtonType.DEL;
		return <Button
			bsStyle="danger"
			bsSize="small"
			key={l.libSiglum + t}
			onClick={this.props.onClick.bind(this,l,t)}
			>Delete
		</Button>;
	}

	render() {
		return [
			(<PanelMenu key="panelMenu">
				<Row>
					<Col sm={4}>
						<Button key="back"
							bsStyle="default"
							onClick={this.props.onBack}
						>Back</Button>
						<Button key="new"
							bsStyle="success"
							onClick={() => this.props.onClick(null,ButtonType.EDIT)}
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
				rowClassName="tr"
				height={window.innerHeight}
				width={window.innerWidth - 50}
				headerHeight={40}
				rowHeight={50}
				rowCount={this.state.libraries.length}
				rowGetter={this.state.rowGetter}
			>
				<Column
					label="Siglum"
					dataKey="libSiglum"
					width={100}
				/>

				<Column
					label="Name"
					dataKey="library"
					// 60*3 (buttons) + 100 (siglum) + 10*6 (margin-right) + 30 (container padding) +
					// 20 (outer v inner window) = 390
					width={window.innerWidth - 420 - (window.innerWidth / 6)}
				/>
				<Column
					label="City"
					dataKey="city"
					width={window.innerWidth / 6}
				/>
				<Column
					label="View"
					dataKey=""
					width={60}
					cellRenderer={this.viewBtnRenderer}
				/>
				<Column
					label="Edit"
					dataKey=""
					width={60}
					cellRenderer={this.editBtnRenderer}
				/>
				<Column
					label="Delete"
					dataKey=""
					width={60}
					cellRenderer={this.deleteBtnRenderer}
				/>
			</Table>),
		];
	}
}
