import * as React from 'react';
import {
	Button,
	Col,
	ControlLabel,
	InputGroup,
	Form,
	FormControl,
	FormGroup,
	HelpBlock
} from 'react-bootstrap';

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';
import ValState from '@src/components/common/FormValidation.ts';

import { Country } from '@src/models/country.ts';
import * as lib from '@src/models/library.ts';

export interface Val {
	libSiglum: ValState
	library: ValState
	city: ValState
	address1: ValState
	address2: ValState
	postCode: ValState
	[x: string]: ValState
}

interface P {
	country: Country
	onSubmit: (editState: S) => void
	onBack: () => void

	editState: {
		lProps?: lib.Properties
		isNew?: boolean
		val?: Val
	}
}
export interface S {
	isNew: boolean
	lProps: lib.Properties
	val: Val
}

export default class LibraryEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
		const es = p.editState || {};

		this.state = {
			isNew: typeof es.isNew === 'boolean' ? es.isNew : !Boolean(es.lProps),
			lProps: es.lProps || lib.Library.createProperties(),
			val: es.val || {
				libSiglum: null,
				library: null,
				city: null,
				address1: null,
				address2: null,
				postCode: null
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
			s.lProps[k] = v;
			/// @ts-ignore we don't care if MAX_LENGTHS is implicitly an any.
			s.val[k] = (v.length && v.length > lib.Library.MAX_LENGTHS[k]) ? 'error' : null;
			return s;
		});
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		var val = this.state.val;
		if (!this.state.lProps.libSiglum) {
			val.libSiglum = 'error';
		}
		if (!this.state.lProps.library) {
			val.library = 'error';
		}
		if (!this.state.lProps.city) {
			val.city = 'error';
		}

		this.setState((s:S) => {
			s.val = val;
			return s;
		});

		for (let k in val) {
			if (val[k] === 'error') {
				return;
			}
		}

		this.setState((s:S) => {
			if (s.isNew && s.lProps.libSiglum.indexOf(s.lProps.countryID + '-') !== 0) {
				s.lProps.libSiglum = s.lProps.countryID + '-' + s.lProps.libSiglum;
			}
			this.props.onSubmit(s);
			// Don't re-render here (onSubmit will render a panel), so don't return s.
		});
	}

	render() {
		var h = this.props.country.country + ': ' + (this.state.isNew
			? 'Create a Library'
			: 'Edit Library ' + this.state.lProps.library);

		return [
			<Header min key="header">{h}</Header>,
			(<PanelMenu key="panel">
				<Button
					onClick = {() => this.props.onBack()}
				>Back</Button>
			</PanelMenu>),

			(<Form horizontal onSubmit={this.onSubmit} key="form">
				<FormGroup controlId="libSiglum" validationState={this.state.val.libSiglum}>
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
										value={this.state.lProps.libSiglum}
										onChange={e => {
											var libSiglum = (e.target as HTMLInputElement).value;
											this.setState((s:S) => {
												s.lProps.libSiglum = libSiglum;
												if (libSiglum) {
													s.val.libSiglum = (libSiglum.length +
														this.props.country.countryID.length + 1 <= lib.Library.MAX_LENGTHS.libSiglum) ? null :
														'error';
												}
												return s;
											});
										}}
										className="dib"
									/>
								</InputGroup>
							</Col>),
							(<HelpBlock key="hb">
								{this.props.country.countryID.length + 1 +
									this.state.lProps.libSiglum.length + ' / 10'}
							</HelpBlock>)]

						: [(<Col
								key="label"
								sm={3}
								componentClass={ControlLabel}
							>Library Siglum:</Col>),
							<Col key="value" sm={4} className="pt7 pl27">{this.state.lProps.libSiglum}</Col>]
					}
				</FormGroup>

				<FormGroup controlId="country">
					<Col sm={3} componentClass={ControlLabel}>Country:</Col>
					<Col sm={4} className="pt7 pl27">{this.props.country.country}</Col>
				</FormGroup>

				<FormGroup
					controlId="library"
					validationState={this.state.val.library}
				>
					<Col sm={3} componentClass={ControlLabel} className="required">Library Name:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.lProps.library}
							onChange={(e) => {
								var library: string = (e.target as HTMLInputElement).value;
								this.setState((s:S) => {
									s.lProps.library = library;
									s.val.library = (library && library.length <= lib.Library.MAX_LENGTHS.library) ?
										null : 'error';
									return s;
								});
							}}
						/>
					</Col>
					<HelpBlock>{this.state.lProps.library.length + ' / 255'}</HelpBlock>
				</FormGroup>

				<FormGroup
					controlId="city"
					validationState={this.state.val.city}
				>
					<Col sm={3} componentClass={ControlLabel} className="required">City:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.lProps.city}
							onChange={e => {
								var city = (e.target as HTMLInputElement).value;
								this.setState((s:S) => {
									s.lProps.city = city;
									s.val.city = (city && city.length <= lib.Library.MAX_LENGTHS.city) ? null : 'error';
									return s;
								});
							}}
						/>
					</Col>
					<HelpBlock>{this.state.lProps.city.length + ' / ' + lib.Library.MAX_LENGTHS.city}</HelpBlock>
				</FormGroup>

				<FormGroup
					controlId="address1"
					validationState={this.state.val.address1}>
					<Col sm={3} componentClass={ControlLabel}>Address:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.lProps.address1}
							onChange={(this.onInputChange)}
						/>
					</Col>
					<HelpBlock>
						{this.state.lProps.address1.length + ' / ' + lib.Library.MAX_LENGTHS.address1}
					</HelpBlock>
				</FormGroup>

				<FormGroup
					controlId="address2"
					validationState={this.state.val.address2}>
					<Col sm={3} componentClass={ControlLabel}>Address 2:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.lProps.address2}
							onChange={this.onInputChange}
						/>
					</Col>
					<HelpBlock>
						{this.state.lProps.address2.length + ' / ' + lib.Library.MAX_LENGTHS.address2}
					</HelpBlock>
				</FormGroup>

				<FormGroup
					controlId="postCode"
					validationState={this.state.val.postCode}>
					<Col sm={3} componentClass={ControlLabel}>Post Code:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.lProps.postCode}
							onChange={this.onInputChange}
						/>
					</Col>
					<HelpBlock>
						{this.state.lProps.postCode.length + ' / ' + lib.Library.MAX_LENGTHS.postCode}
					</HelpBlock>
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
