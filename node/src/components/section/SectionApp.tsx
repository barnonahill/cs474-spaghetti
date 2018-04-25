import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import { Manuscript } from '@src/models/manuscript.ts';
import * as sn from '@src/models/section.ts';
// Support Entities
import { Century } from '@src/models/century.ts';
import { Cursus } from '@src/models/cursus.ts';
import { SourceCompleteness } from '@src/models/sourceCompleteness.ts';
import { Provenance } from '@src/models/provenance.ts';
import { Notation } from '@src/models/notation.ts';

enum Panel {
	INIT=0,
	EDIT=1,
	ENTITY=2,
	TABLE=3,
	LOADER=4
}

interface P {
	countries: Country[]
	onBack: () => void
	// Opened from ManuscriptEntityPanel
	panel?: Panel
	country?: Country
	library?: Library
	manuscript?: Manuscript
}
interface S {
	panel: Panel
	loadMessage?: string
}
export default class SectionApp extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.renderInit = this.renderInit.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderEntity = this.renderEntity.bind(this);
		this.renderTable = this.renderTable.bind(this);
		this.renderLoader = this.renderLoader.bind(this);
	}

	render() {
		switch (this.state.panel) {
			default:
			case Panel.INIT:
				return this.renderInit();

			case Panel.EDIT:
			 	return this.renderEdit();

			case Panel.ENTITY:
				return this.renderEntity();

			case Panel.TABLE:
				return this.renderTable();

			case Panel.LOADER:
				return this.renderLoader();
		}
	}

	renderInit() {}

	renderEdit() {}

	renderEntity() {}

	renderTable() {}

	renderLoader() {
		return <PageLoader inner={this.state.loadMessage} />;
	}
}
