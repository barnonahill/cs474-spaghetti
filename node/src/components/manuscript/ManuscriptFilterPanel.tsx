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
import proxyFactory from '@src/proxies/ProxyFactory.ts';

interface P {
	countries: Array<Country>
	onBack: () => void
	onSelect: (c:Country, l:Library, libraries: Array<Library>) => void
}
interface S {
	countryOptions: Options
	countryOption: Option
	libraries: Array<Library>
	libraryOptions: Options
	libraryOption: Option
	val: {
		countryID: any
		libSiglum: any
	}
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
			val: {
				countryID: null,
				libSiglum: null
			}
		};
		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onLibrarySelect = this.onLibrarySelect.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onCountrySelect(o:Option) {
		if (o) {
			proxyFactory.getLibraryProxy().getLibraries(o.value as string, (libraries:Array<Library>,e?:string) => {
				if (e) {
					alert(e);
				}
				else {
					this.setState((s:S) => {
						s.countryOption = o;
						Library.destroyArray(s.libraries);
						s.libraries = libraries;
						s.libraryOption = null;
						s.libraryOptions = s.libraries.map((l:Library) => {
							return {label: l.library, value: l.libSiglum};
						});
						return s;
					});
				}
			});
		}
		else {
			this.setState((s:S) => {
				s.countryOption = null;
				Library.destroyArray(s.libraries);
				s.libraryOption = null;
				s.libraryOptions = null;
				return s;
			});
		}
	}

	onLibrarySelect(o:Option) {
		this.setState((s:S) => {
			s.libraryOption = o;
			return s;
		});
	}

	onSubmit(e: React.FormEvent<Form>) {
		e.preventDefault();
		var country: Country = null;
		var library: Library = null;

		var val:any = {
			countryID: this.state.countryOption ? null : 'error',
			libSiglum: this.state.libraryOption ? null : 'error'
		};
		for (let k in val) {
			if (val[k] !== null) {
				return this.setState((s:S) => {
					s.val = val;
					return s;
				})
			}
		}

		if (this.state.countryOption) {
			country = this.props.countries.find((c: Country) => {
				return c.countryID === this.state.countryOption.value;
			});

			if (this.state.libraryOption) {
				library = this.state.libraries.find((l: Library) => {
					return l.libSiglum === this.state.libraryOption.value;
				});
			}
		}

		this.setState((s:S) => {
			this.props.onSelect(country, library, s.libraries);
			s.val = val;
			return s;
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

			(<Form horizontal key="form" onSubmit={this.onSubmit}>
				<FormGroup
					controlId="countryID"
					validationState={this.state.val.countryID}
				>
					<Col sm={3}
						componentClass={ControlLabel}
						className="required"
					>Country:</Col>
					<Col sm={4}>
						<Select
							name="countryID"
							value={this.state.countryOption}
							options={this.state.countryOptions}
							onChange={this.onCountrySelect}
							className={this.state.val.countryID === null ? '' : 'has-error'}
						/>
					</Col>
				</FormGroup>

				<FormGroup
					controlId="libSiglum"
					validationState={this.state.val.libSiglum}
				>
					<Col sm={3}
						componentClass={ControlLabel}
						className="required"
					>Library:</Col>
					<Col sm={4}>
						<Select
							name="libSiglum"
							value={this.state.libraryOption}
							options={this.state.libraryOptions}
							onChange={this.onLibrarySelect}
							className={this.state.val.libSiglum == null ? '' : 'has-error'}
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
