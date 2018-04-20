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
import {
	default as Select,
	Options,
	Option
} from 'react-select';

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
}

export default class LibraryEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var state: S;

		if (p.library) {
			const l = p.library;
			state = {
				isNew: false,
				props: l.toProperties()
			};
		}
		else {
			state = {
				isNew: true,
				props: {
					libSiglum: '',
					countryID: p.country.countryID,
					city: '',
					library: '',
					address1: '',
					address2: '',
					postCode: ''
				}
			};
		}

		this.state = state;
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
				<FormGroup controlId="libSiglum">
					<Col sm={3} componentClass={ControlLabel}>Library Siglum:</Col>
					{this.state.isNew
						? (<Col sm={4}>
								<InputGroup>
									<InputGroup.Addon>{this.props.country.countryID}-</InputGroup.Addon>
									<FormControl
										type="text"
										value={this.state.props.libSiglum}
										onChange={this.onInputChange}
										className="dib"
									/>
								</InputGroup>
							</Col>)
						: <Col sm={4} className="pt7 pl26">{this.state.props.libSiglum}</Col>
					}
				</FormGroup>

				<FormGroup controlId="countryID">
					<Col sm={3} componentClass={ControlLabel}>Country:</Col>
					<Col sm={4} className="pt7 pl26">{this.props.country.country}</Col>
				</FormGroup>

				<FormGroup controlId="library">
					<Col sm={3} componentClass={ControlLabel}>Library Name:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.props.library}
							onChange={this.onInputChange}
						/>
					</Col>
				</FormGroup>

				<FormGroup controlId="city">
					<Col sm={3} componentClass={ControlLabel}>City:</Col>
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
