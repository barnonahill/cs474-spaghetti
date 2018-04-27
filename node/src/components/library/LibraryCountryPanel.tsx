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

import PanelMenu from '@src/components/common/PanelMenu.tsx';

import { Country } from '@src/models/country.ts';

interface P {
	country?: Country
	countries: Array<Country>
	onSubmit: (c:Country) => void
	onBack: () => void
}
interface S {
	options: Options
	option: Option
	val: any
}

export default class LibraryCountryPanel extends React.Component<P, S> {
	constructor(props: P) {
		super(props);

		var option = props.country
			? {label:props.country.country, value:props.country.countryID}
			: null;

		var options: Options = props.countries.map((c: Country) => {
			return {
				label: c.country,
				value: c.countryID
			};
		});

		this.state = {
			options: options,
			option: option,
			val: null
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(option: Option) {
		this.setState((state: S) => {
			state.option = option;
			return state;
		});
	}

	onSubmit(e: React.FormEvent<Form>) {
		e.preventDefault();
		if (!this.state.option) {
			return this.setState((s:S) => {
				s.val = 'error';
				return s;
			});
		}
		var country: Country = this.props.countries.find((c: Country) => {
			return this.state.option.value === c.countryID
		});
		this.props.onSubmit(country);
	}

	public render() {
		return [
			(<PanelMenu key="panelMenu">
				<Button
					bsStyle="default"
					onClick={this.props.onBack}
				>Back</Button>
			</PanelMenu>),

			(<Alert bsStyle="info" className="mb20 mr15p ml15p text-center" key="alert">
				<strong>Select a country to view its libraries.</strong>
			</Alert>),

			(<Form horizontal key="form" onSubmit={this.onSubmit}>
				<FormGroup
					controlId="countryID"
					validationState={this.state.val}
				>
					<Col sm={3} componentClass={ControlLabel} className="required">Country:</Col>
					<Col sm={4}>
						<Select
							name="countryID"
							value={this.state.option}
							options={this.state.options}
							onChange={this.onChange}
							className={this.state.val ? 'has-error': ''}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="submit">
					<Col smOffset={3} sm={4}>
						<Button
							bsStyle="primary"
							type="submit"
						>Load</Button>
					</Col>
				</FormGroup>
			</Form>)
		];
	}
}
