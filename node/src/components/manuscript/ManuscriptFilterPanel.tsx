import * as React from 'react';
import {
	Alert,
	Button,
	Col,
	ControlLabel,
	Form,
	FormGroup
} from 'react-bootstrap';
import {
	default as Select,
	Option,
	Options
} from 'react-select';

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';

interface P {
	countries: Array<Country>
	onBack: () => void
	onSelect: (c:Country, l?:Library) => void
}
interface S {
	countryOptions: Options
	countryOption: Option
	libraries: Array<Library>
	libraryOptions: Options
	libraryOption: Option
	loadDisabled: boolean
}

export default class ManuscriptFilterPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			countryOptions: this.props.countries.map((c:Country) => {
				return {label: c.country, value: c.countryID};
			}),
			countryOption: null,
			libraries: null,
			libraryOptions: null,
			libraryOption: null,
			loadDisabled: true
		};
		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onLibrarySelect = this.onLibrarySelect.bind(this);
	}

	onCountrySelect(o:Option) {
		this.setState((s:S) => {
			s.countryOption = o;
			s.loadDisabled = o === null;
			if (s.loadDisabled) {
				s.libraryOption = null;
				s.libraryOptions = null;
				if (s.libraries) {
					Library.destroyArray(s.libraries);
				}
			}
			return s;
		});
	}

	onLibrarySelect(o:Option) {
		this.setState((s:S) => {
			s.libraryOption = o;
		});
	}

	render() {
		return [
			<Header key="header" min>Filter Manuscripts</Header>,
			(<PanelMenu key="panelMenu">
				<Button
					bsStyle="default"
					onClick={this.props.onBack}
				>Back</Button>
			</PanelMenu>),

			(<Alert
				bsStyle="info"
				className="mb20 mr15p ml15p text-center"
				key="alert"
			><strong>Filter manuscripts by country and library.</strong></Alert>),

			<Form horizontal key="form">
				<FormGroup controlId="countryID">
					<Col sm={3} componentClass={ControlLabel}>Country:</Col>
					<Col sm={4}>
						<Select
							name="countryID"
							value={this.state.countryOption}
							options={this.state.countryOptions}
							onChange={this.onCountrySelect}
						/>
					</Col>
				</FormGroup>
			</Form>
		];
	}
}
