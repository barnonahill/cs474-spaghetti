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
	Options,
	Option
} from 'react-select';

import Header from '@src/components/Header.tsx';
import {
	default as Table,
	ButtonType as TButtonType
} from '@src/components/library/LibraryTable.tsx';
import EntityForm from '@src/components/library/LibraryEntityView.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum View {
	INIT = 0,
	TABLE = 1,
	ENTITY = 2,
	EDIT = 3,
}

interface Properties {
	stack: Array<any>
	countries: Array<Country>
}

interface State {
	libraries: Array<Library>
	view: View
	country?: Country
	library?: Library
	[x: string]: any
}

export default class LibraryPage extends React.Component<Properties, State> {
	constructor(props: Properties) {
		super(props);
		this.state = {
			libraries: null,
			view: View.INIT
		};

		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onTableClick = this.onTableClick.bind(this);
	}

	onCountrySelect(c: Country) {
		proxyFactory.getLibraryProxy().getLibraries(c.countryID, (libs:Array<Library>, e?:string) => {
			if (e) {
				alert(e);
			}

			this.setState((s:State) => {
				s.view = View.TABLE;
				s.country = c;
				s.libraries = libs;
				return s;
			});
		});
	}

	onTableClick(l:Library, t:TButtonType) {
		switch (t) {
			case TButtonType.VIEW:
			default:
				this.changeView(View.ENTITY,{library:l});
				break;
			case TButtonType.EDIT:
				this.changeView(View.EDIT,{library:l});
				break;
			case TButtonType.DEL:
				// delete confirmation
				break;
		}
	}

	changeView(v:View, stateOpts:Partial<State>) {
		this.setState((s:State) => {
			s.view = v;
			if (stateOpts) {
				for (let k in stateOpts) {
					s[k] = stateOpts[k];
				}
			}
			return s;
		});
	}

	render() {
		switch (this.state.view) {
			case View.INIT:
			default:
				return [
					<Header key="header">Libraries</Header>,
					(<div key="panel" className="panel panel-default pt15 pb15">
						<CountrySelectForm
							countries={this.props.countries}
							onExit={this.onCountrySelect}
							key="panel"
						/>
					</div>)
				];
			case View.TABLE:
				return [
					<Header key="header">Libraries - {this.state.country.country}</Header>,
					(<div key="panel" className="panel panel-default pt15 pb15">
						<Table
							key="grid"
							country={this.state.country}
							libraries={this.state.libraries}
							onClick={this.onTableClick}
							onBack={() => this.changeView(View.INIT,null)}
						/>
					</div>)
				];
			case View.ENTITY:
				return [
					<Header key="header">{this.state.library.library}</Header>,
					(<div key="panel" className="panel panel-default pt15 pb15">
						<EntityForm
							country={this.state.country}
							library={this.state.library}
							onBack={() => this.changeView(View.TABLE,null)}
						/>
					</div>)
				];
			case View.EDIT:
				return null;
		}
	}
}

interface CSFProps {
	countries: Array<Country>
	onExit: (c:Country) => void
}
interface CSFState {
	options: Options
	option: Option
	loadDisabled: boolean
}

class CountrySelectForm extends React.Component<CSFProps, CSFState> {
	constructor(props: CSFProps) {
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
		this.setState((state: CSFState) => {
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
		this.props.onExit(country);
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