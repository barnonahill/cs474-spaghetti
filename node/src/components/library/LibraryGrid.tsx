import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
	Table,
	Column,
	TableCellProps,
	Index
} from 'react-virtualized';

import 'react-virtualized/styles.css'

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';

enum DataKey {
	LIBRARY = 'library',
	CITY = 'city',
	VIEW = 'view',
	EDIT = 'edit',
	DELETE = 'delete'
}

interface Properties {
	country: Country
	libraries: Array<Library>
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

export default class LibraryTable extends React.Component<Properties, State> {
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
		// props.rowData: Library
		return <Button
			bsStyle="primary"
			bsSize="small"
			key={'r' + props.rowIndex + 'v'}
			>View
		</Button>;
	}

	editBtnRenderer(props: TableCellProps) {
		return <Button
			bsStyle="primary"
			bsSize="small"
			key={'r' + props.rowIndex + 'e'}
			>Edit
		</Button>;
	}

	deleteBtnRenderer(props: TableCellProps) {
		return <Button
			bsStyle="danger"
			bsSize="small"
			key={'r' + props.rowIndex + 'd'}
			>Delete
		</Button>;
	}

	render() {
		return (<Table
			height={this.state.tabHeight}
			width={this.state.tabWidth}
			headerHeight={40}
			rowHeight={40}
			rowCount={this.props.libraries.length}
			rowGetter={this.state.rowGetter}
		>
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
				dataKey="view"
				width={this.state.columnWidth}
				cellRenderer={this.viewBtnRenderer}
			/>
			<Column
				label="Edit"
				dataKey="edit"
				width={this.state.columnWidth}
				cellRenderer={this.editBtnRenderer}
			/>
			<Column
				label="Delete"
				dataKey="delete"
				width={this.state.columnWidth}
				cellRenderer={this.deleteBtnRenderer}
			/>
		</Table>);
	}
}
