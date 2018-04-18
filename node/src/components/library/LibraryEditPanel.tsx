import * as React from 'react';
import {
	Button,
	Col,
	ControlLabel,
	Form,
	FormControl,
	FormGroup,
} from 'react-bootstrap';
import {
	default as Select
} from 'react-select';

import { Country } from '@src/models/country.ts';
import * as lib from '@src/models/library.ts';

interface P {
	library?: lib.Library
	countries: Array<Country>
}
interface S {
	isNew: boolean
	props: lib.Properties
}

export default class LibraryEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
		var state: S;

		if (this.props.library) {
			const l = this.props.library;
			state = {
				isNew: false,
				props: l.toProperties()
			};
		}
		else {
			state = {
				isNew: true,
				props: {
					libSiglum: null,
					countryID: null,
					city: null,
					library: null,
					address1: null,
					address2: null,
					postCode: null
				}
			};
		}

		this.state = state;
	}

	render() {
		if (this.state.isNew) {
			return (<Form horizontal>
				<FormGroup controlId="libSiglum">
					<Col sm={3} componentClass={ControlLabel}>Library Siglum:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.props.libSiglum}
							onChange={this.onInputChange}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="countryID">
					<Col sm={3} componentClass={ControlLabel}>Country:</Col>
					<Col sm={4}>
						<Select
							name="countryID"
							value={this.state.option}
							options={this.state.options}
							onChange={this.onSelectChange}
				</FormGroup>
			</Form>);
		}
	}
}
