import * as React from 'react';
import {
	Button
} from 'react-bootstrap';
import {
	Table,
	Column,
	TableCellProps,
	Index,
	TableCellDataGetterParams
} from 'react-virtualized';
import 'react-virtualized/styles.css'

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import { Manuscript } from '@src/models/manuscript.ts';

interface P {
	country: Country
	library: Library
	manuscripts: Array<Manuscript>
	onBack: () => void
}
interface S {
	// Array of Library properties as Arrays
	list: Array<Array<string>>
	tabHeight: number
	tabWidth: number
	columnCount: number
	columnWidth: number
	rowGetter: any
}

export default class ManuscriptTablePanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var list = this.props.manuscripts.map((m:Manuscript) => {
			return [
				m.libSiglum,
				m.msSiglum,
				m.msType,
				null, // view
				null, // edit
				null, // delete
			];
		});

		this.getHeader = this.getHeader.bind(this);
	}

	getHeader() {
		var h = 'Manuscripts';
		if (this.props.country) {
			if (this.props.library) {
				h += ' - ' + this.props.library.library + ', ' + this.props.country.country;
			}
			else {
				h += ' - ' + this.props.country.country;
			}
		}
		return h;
	}

	render() {
		return [
			<Header key="header" min>{this.getHeader()}</Header>,
			<PanelMenu key="panelMenu">
				<Button
					bsStyle="default"
					onClick={this.props.onBack}
				>Back</Button>
			</PanelMenu>
		];
	}
}
