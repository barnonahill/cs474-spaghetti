import * as React from 'react';
import {
	Button,
	Col,
	ControlLabel,
	InputGroup,
	Form,
	FormControl,
	FormGroup,
} from 'react-bootstrap';

import PanelMenu from '@src/components/common/PanelMenu.tsx';

import { Country } from '@src/models/country.ts';
import * as lib from '@src/models/library.ts';

interface P {
	library?: lib.Library
	country: Country
	onSubmit: (props:lib.Properties, isNew:boolean) => void
	onBack: () => void
}
interface S {
	isNew: boolean
	props: lib.Properties
	valStates: {
		libSiglum: any
		library: any
		city: any
	}
}

export default class LibraryEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var state: S;
		var isNew: boolean;
		var props: lib.Properties;

		if (p.library) {
			isNew = false;
			props = p.library.toProperties();
		}
		else {
			isNew = true;
			props = {
				libSiglum: '',
				countryID: p.country.countryID,
				city: '',
				library: '',
				address1: '',
				address2: '',
				postCode: ''
			};
		}

		this.state = {
			isNew: isNew,
			props: props,
			valStates: {
				libSiglum: null,
				library: null,
				city: null,
			}
		};

		this.onInputChange = this.onInputChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onInputChange(e:React.FormEvent<FormControl>) {
		const target = e.target as HTMLInputElement;
		const k = target.id;
		const v = target.value;
		this.setState((s:S) => {
			s.props[k] = v;
			return s;
		});
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		const props: lib.Properties = this.state.props;

		var valStates:any = {
			libSiglum: props.libSiglum ? null : 'error',
			library: props.library ? null : 'error',
			city: props.city ? null : 'error'
		}
		this.setState((s:S) => {
			// Render validation states
			s.valStates = valStates;
			return s;
		});
		for (let k in valStates) {
			if (valStates[k] === 'error') {
				return;
			}
		}

		const isNew: boolean = this.state.isNew;
		if (isNew && props.libSiglum.indexOf(props.countryID + '-') !== 0) {
			props.libSiglum = props.countryID + '-' + props.libSiglum;
		}
		this.props.onSubmit(props, isNew);
	}

	render() {
		return [
			(<PanelMenu key="panel">
				<Button
					onClick = {() => this.props.onBack()}
				>Back</Button>
			</PanelMenu>),

			(<Form horizontal onSubmit={this.onSubmit} key="form">
				<FormGroup controlId="libSiglum" validationState={this.state.valStates.libSiglum}>
					{this.state.isNew
						? [(<Col sm={3} key="label"
								componentClass={ControlLabel}
								className="required"
							>Library Siglum:</Col>),
							(<Col sm={4} key="value">
								<InputGroup>
									<InputGroup.Addon>{this.props.country.countryID}-</InputGroup.Addon>
									<FormControl
										type="text"
										value={this.state.props.libSiglum}
										onChange={this.onInputChange}
										className="dib"
									/>
								</InputGroup>
							</Col>)]

						: [(<Col
								key="label"
								sm={3}
								componentClass={ControlLabel}
							>Library Siglum:</Col>),
							<Col key="value" sm={4} className="pt7 pl26">{this.state.props.libSiglum}</Col>]
					}
				</FormGroup>

				<FormGroup controlId="countryID">
					<Col sm={3} componentClass={ControlLabel}>Country:</Col>
					<Col sm={4} className="pt7 pl26">{this.props.country.country}</Col>
				</FormGroup>

				<FormGroup
					controlId="library"
					validationState={this.state.valStates.library}
				>
					<Col sm={3} componentClass={ControlLabel} className="required">Library Name:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.props.library}
							onChange={this.onInputChange}
						/>
					</Col>
				</FormGroup>

				<FormGroup
					controlId="city"
					validationState={this.state.valStates.city}
				>
					<Col sm={3} componentClass={ControlLabel} className="required">City:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.props.city}
							onChange={this.onInputChange}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="address1">
					<Col sm={3} componentClass={ControlLabel}>Address:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.props.address1}
							onChange={this.onInputChange}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="address2">
					<Col sm={3} componentClass={ControlLabel}>Address 2:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.props.address2}
							onChange={this.onInputChange}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="postCode">
					<Col sm={3} componentClass={ControlLabel}>Post Code:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.props.postCode}
							onChange={this.onInputChange}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="submit">
					<Col smOffset={3} sm={4}>
						<Button
							bsStyle="success"
							type="submit"
							>Save
						</Button>
					</Col>
				</FormGroup>
			</Form>)
		];
	}
}
