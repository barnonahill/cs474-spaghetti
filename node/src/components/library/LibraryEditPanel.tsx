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

import { Country } from '@src/models/country.ts';
import * as lib from '@src/models/library.ts';

export interface Val {
	libSiglum: null | 'error'
	library: null | 'error'
	city: null | 'error'
	[x: string]: any
}

interface P {
	country: Country
	onSubmit: (props:lib.Properties, isNew:boolean) => void
	onBack: () => void

	lProps?: lib.Properties
	isNew?: boolean
	val?: Val
}
interface S {
	isNew: boolean
	lProps: lib.Properties
	val: Val
}

export default class LibraryEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var isNew: boolean;
		if (typeof p.isNew === 'boolean') {
			isNew = p.isNew;
		}
		else {
			isNew = !Boolean(p.lProps);
		}

		var lProps = p.lProps || {
			countryID: p.country.countryID,
			libSiglum: '',
			library: '',
			city: '',
			address1: '',
			address2: '',
			postCode: ''
		};

		this.state = {
			isNew: isNew,
			lProps: lProps,
			val: p.val || {
				libSiglum: null,
				library: null,
				city: null
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
			return s;
		});
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		const lProps: lib.Properties = this.state.lProps;
		var val: Val = {
			libSiglum: lProps.libSiglum ? null : 'error',
			library: lProps.library ? null : 'error',
			city: lProps.city ? null : 'error'
		}
		this.setState((s:S) => {
			// Render validation states
			s.val = val;
			return s;
		});
		for (let k in val) {
			if (val[k] === 'error') {
				return;
			}
		}

		const isNew: boolean = this.state.isNew;
		if (isNew && lProps.libSiglum.indexOf(lProps.countryID + '-') !== 0) {
			lProps.libSiglum = lProps.countryID + '-' + lProps.libSiglum;
		}
		this.props.onSubmit(lProps, isNew);
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
										onChange={this.onInputChange}
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

				<FormGroup controlId="countryID">
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
							onChange={this.onInputChange}
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
							onChange={this.onInputChange}
						/>
					</Col>
					<HelpBlock>{this.state.lProps.city.length + ' / 255'}</HelpBlock>
				</FormGroup>

				<FormGroup controlId="address1">
					<Col sm={3} componentClass={ControlLabel}>Address:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.lProps.address1}
							onChange={this.onInputChange}
						/>
					</Col>
					<HelpBlock>{this.state.lProps.address1.length + ' / 255'}</HelpBlock>
				</FormGroup>

				<FormGroup controlId="address2">
					<Col sm={3} componentClass={ControlLabel}>Address 2:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.lProps.address2}
							onChange={this.onInputChange}
						/>
					</Col>
					<HelpBlock>{this.state.lProps.address2.length + ' / 255'}</HelpBlock>
				</FormGroup>

				<FormGroup controlId="postCode">
					<Col sm={3} componentClass={ControlLabel}>Post Code:</Col>
					<Col sm={4}>
						<FormControl
							type="text"
							value={this.state.lProps.postCode}
							onChange={this.onInputChange}
						/>
					</Col>
					<HelpBlock>{this.state.lProps.postCode.length + ' / 12'}</HelpBlock>
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
