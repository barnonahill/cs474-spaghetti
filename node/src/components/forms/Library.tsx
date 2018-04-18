import * as React from 'react';

import {
	Col,
	Form,
	FormGroup,
	ControlLabel,
	FormControl,
	HelpBlock
} from 'react-bootstrap';

import {
	default as ReactSelect,
	Option as SelectOption,
	Options as SelectOptions
} from 'react-select';

import * as ctry from '@src/models/country.ts';
import * as lib from '@src/models/library.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

interface Properties {
	stack: Array<any>; // TODO figure out what any is
}

interface State extends Properties {
	values: lib.Properties
}

export default class LibraryForm extends React.Component<Properties, State> {
	private countries: Array<ctry.Country>;
	private countryOptions: SelectOptions;

	constructor(props: any) {
		super(props);
		this.state = {
			stack: props.stack,
			values: {
				libSiglum: 'hi!',
				countryID: '',
				city: '',
				library: '',
				address1: '',
				address2: '',
				postCode: '',
			}
		};

		//this.getCountries();

		// Bind `this` keyword to state change handlers
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	private getCountries() {
		proxyFactory.getLibraryProxy().getCountries((countries: Array<ctry.Country>, err?: string) => {
			if (err) {
				console.error(err);
				alert(err);
			}
			else {
				this.countries = countries;
				console.log(this.countries);
				this.parseSelectOptions();
			}
		});
	}

	private parseSelectOptions() {
		if (this.countries && this.countries.length) {
			this.countryOptions = this.countries.map((country: ctry.Country) => {
				return {
					label: country.country,
					value: country.countryID
				};
			});
		}
	}

	private updateState(name: string, value: string) {
		this.setState((state: State, props: Properties) => {
			state.values[name] = value;
			return state;
		});
	}

	private handleInputChange(e: React.FormEvent<FormControl>) {
		const target = e.target as HTMLInputElement;
		this.updateState(target.id, target.value);
	}

	private handleSelectChange(option: SelectOption) {
		this.updateState('countryID', option.value as string);
	}

	private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		// TODO validate user input!

		var props: lib.Properties = this.state.values;

		var country: ctry.Country;
		var i = this.countries.findIndex((c: ctry.Country) => {
			return c.countryID === props.countryID;
		});
		if (i >= 0) {
			country = this.countries[i];
			// Remove country from array so it isn't deleted when our component is cleaned.
			this.countries.splice(i, 1);
		}

		// Use the libraryProxy to submit
		proxyFactory.getLibraryProxy().createLibrary(props, (l: lib.Library, err?: string) => {
			if (err) {
				alert(err);
			}


		});
	}

	public render() {
		return (
			<Form horizontal>
				<FormGroup controlId="libSiglum">
					<Col componentClass={ControlLabel} sm={3}>Library Siglum:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.values.libSiglum}
							onChange={this.handleInputChange}
						/>
					</Col>
				</FormGroup>
				<FormGroup controlId="countryID">
					<Col componentClass={ControlLabel} sm={3}>Country:</Col>
					<Col sm={4}>
						<ReactSelect
							name="countryID"
							value={this.state.values.countryID}
							onChange={this.handleSelectChange}
						/>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}
