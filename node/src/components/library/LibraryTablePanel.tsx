import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
	Table,
	Column,
	TableCellProps,
	Index,
	TableCellDataGetterParams
} from 'react-virtualized';
import 'react-virtualized/styles.css'

import PanelMenu from '@src/components/common/PanelMenu.tsx';

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
	// Array of Library properties as Arrays
	list: Array<Array<string>>
	tabHeight: number
	tabWidth: number
	columnCount: number
	columnWidth: number
	rowGetter: any
}

export default class LibraryTablePanel extends React.Component<Properties, State> {
	constructor(props: Properties) {
		super(props);

		var list = this.props.libraries.map((l: Library) => {
			return [
				l.library,
				l.city,
				null, // View
				null, // Edit
				null, // Delete
			];
		});
		var tabHeight = window.innerHeight * 0.7;
		var tabWidth = window.innerWidth * 0.9;
		var rowCount = list.length;
		var columnCount = list.length ? list[0].length : 0;
		var columnWidth = tabWidth / columnCount;

		var rowGetter = (i:Index) => {
			return this.props.libraries[i.index];
		}

		this.state = {
			list: list,
			tabHeight: tabHeight,
			tabWidth: tabWidth,
			columnCount: columnCount,
			columnWidth: columnWidth,
			rowGetter: rowGetter
		};

		this.viewBtnRenderer = this.viewBtnRenderer.bind(this);
		this.editBtnRenderer = this.editBtnRenderer.bind(this);
		this.deleteBtnRenderer = this.deleteBtnRenderer.bind(this);
	}

	viewBtnRenderer(props: TableCellProps) {
		const l: Library = props.rowData;
		const t = ButtonType.VIEW;
		// props.rowData: Library
		return <Button
			bsStyle="primary"
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
			bsStyle="primary"
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
				<Button key="back"
					bsStyle="default"
					onClick={this.props.onBack}
				>Back</Button>

				<Button key="new"
					bsStyle="primary"
					onClick={this.props.onClick.bind(this,null,ButtonType.EDIT)}
					className="ml15"
				>New</Button>

				<Button key="refresh"
					bsStyle="primary"
					onClick={this.props.onRefresh}
					className="fr"
				>Refresh</Button>
			</PanelMenu>),

			(<Table key="table"
				height={this.state.tabHeight}
				width={this.state.tabWidth}
				headerHeight={40}
				rowHeight={40}
				rowCount={this.props.libraries.length}
				rowGetter={this.state.rowGetter}
			>
				<Column
					label="Siglum"
					dataKey="libSiglum"
					width={120}
				/>

				<Column
					label="Library"
					dataKey="library"
					width={this.state.columnWidth}
				/>
				<Column
					label="City"
					dataKey="city"
					width={this.state.columnWidth}
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
