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

import { Country } from '@src/models/country.ts';

interface P {
	countries: Array<Country>
	onSubmit: (c:Country) => void
	//onBack: () => void
}
interface S {
	options: Options
	option: Option
	loadDisabled: boolean
}

export default class LibraryCountryPanel extends React.Component<P, S> {
	constructor(props: P) {
		super(props);
		var options: Options = props.countries.map((c: Country) => {
			return {
				label: c.country,
				value: c.countryID
			};
		});

		this.state = {
			options: options,
			option: null,
			loadDisabled: true
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(option: Option) {
		this.setState((state: S) => {
			state.option = option;
			state.loadDisabled = option === null;
			return state;
		});
	}

	onSubmit(e: React.FormEvent<Form>) {
		e.preventDefault();
		var country: Country = this.props.countries.find((c: Country) => {
			return this.state.option.value === c.countryID
		});
		this.props.onSubmit(country);
	}

	public render() {
		return [
			(<Alert bsStyle="info" className="mb20 mr15p ml15p text-center" key="alert">
				<strong>Select a country to view libraries.</strong>
			</Alert>),

			(<Form horizontal key="form" onSubmit={this.onSubmit}>
				<FormGroup controlId="countryID">
					<Col sm={3} componentClass={ControlLabel}>Country:</Col>
					<Col sm={4}>
						<Select
							name="countryID"
							value={this.state.option}
							options={this.state.options}
							onChange={this.onChange}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="submit">
					<Col smOffset={3} sm={4}>
						<Button
							bsStyle="primary"
							type="submit"
							disabled={this.state.loadDisabled}
							>Load
						</Button>
						<Button className="ml15">Back</Button>
					</Col>
				</FormGroup>
			</Form>)
		];
	}
}
