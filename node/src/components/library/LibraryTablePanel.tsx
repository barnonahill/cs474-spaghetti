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
	rowGetter: any
}

export default class LibraryTablePanel extends React.Component<Properties, State> {
	constructor(props: Properties) {
		super(props);

		var rowGetter = (i:Index) => {
			return this.props.libraries[i.index];
		}

		this.state = {
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
				rowClassName="tr"
				height={window.innerHeight}
				width={window.innerWidth - 50}
				headerHeight={40}
				rowHeight={50}
				rowCount={this.props.libraries.length}
				rowGetter={this.state.rowGetter}
			>
				<Column
					label="Siglum"
					dataKey="libSiglum"
					width={100}
				/>

				<Column
					label="Library"
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
