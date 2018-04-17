import * as React from 'react';
import {
	FormGroup,
	ControlLabel,
	FormControl,
	HelpBlock
} from 'react-bootstrap';

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

	constructor(props: any) {
		super(props);
		this.state = {
			stack: props.stack || [], // TODO remove || [] when navigation stack is functional.
			values: {
				libSiglum: '',
				countryID: '',
				city: '',
				library: '',
				address1: '',
				address2: '',
				postCode: '',
			}
		};

		this.getCountries();

		// Bind `this` keyword to state change handlers
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getCountries() {
		proxyFactory.getLibraryProxy().getCountries((countries: Array<ctry.Country>, err?: string) => {
			if (err) {
				console.error(err);
				alert(err);
			}
			else {
				this.countries = countries;
				console.log(this.countries);
			}
		});
	}

	handleInputChange(e: React.FormEvent<HTMLInputElement>) {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		const name = target.name;

		this.setState((state: State) => {
			state.values[name] = value;
		});
	}

	handleSubmit(e: React.FormEvent<HTMLFormElement>) {

	}

	render() {
		return (
			<form className="form-horizontal" onSubmit={this.handleSubmit}>
				<FormGroup
					controlId = "libSiglum"
				>
					<ControlLabel>Library Siglum:</ControlLabel>
					<FormControl
						type = "text"
						value = {this.state.values.libSiglum}
					/>
					<FormControl.Feedback />
					<HelpBlock>The siglum is the library identifier</HelpBlock>
				</FormGroup>
			</form>
		);
	}
}
