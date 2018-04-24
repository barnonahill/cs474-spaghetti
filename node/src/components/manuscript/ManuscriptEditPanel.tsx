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

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import * as ms from '@src/models/manuscript.ts';
import { MsType } from '@src/models/msType.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

interface P {
	country: Country
	countries: Country[]
	library: Library
	msTypes: MsType[]
	manuscript: ms.Manuscript
	onBack: () => void
}
interface S {
	isNew: boolean
	msProps: ms.Properties
	val: {
		countryID: any
		libSiglum: any
		msSiglum: any
		msType: any
	}
	opts: {
		country?: Option
		countries?: Options
		library?: Option
		libraries?: Options
		msType: Option
		msTypes: Options
	}
	ents: {
		country: Country
		library: Library
		libraries: Library[]
		msType: MsType
	}
}

export default class ManuscriptEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var msTypeOptions = p.msTypes.map((m:MsType) => {
			return {label: m.msTypeName, value: m.msType};
		});

		var isNew = !Boolean(p.manuscript);
		var state: any = {
			isNew: isNew,
			opts: {},
			val: {msType:null, msTypes: msTypeOptions}
		};

		state.opts.msTypeOptions = p.msTypes.map((m:MsType) => {
			return {label:m.msType, value:m.msTypeName};
		});

		if (isNew) {
			state.msProps = {
				libSiglum: '',
				msSiglum: '',
				msType: '',
				dimensions: '',
				leaves: null,
				foliated: false,
				vellum: false,
				binding: '',
				sourceNotes: '',
				summary: '',
				bibliography: ''
			};

			state.ents = {
				country: null,
				library: null,
				msType: null
			};

			state.val.countryID = null;
			state.val.libSiglum = null;
			state.val.msSiglum = null;

			// Country Options
			state.opts.countries = p.countries.map(c => {
				return {label:c.country, value:c.countryID};
			});
			state.opts.country = null;
		}
		// Edit mode
		else {
			state.msProps = p.manuscript.toProperties();
			state.ents.country = p.countries.find(c => state.msProps.countryID === c.countryID);
			state.ents.library = p.library;
			state.ents.msType = p.msTypes.find(mt => state.msProps.msType === mt.msType)
		}

		this.state = state;

		this.loadLibraries(true);
		this.loadLibraries = this.loadLibraries.bind(this);

		this.getCountryIDFormGroup = this.getCountryIDFormGroup.bind(this);
		this.getLibSiglumFormGroup = this.getLibSiglumFormGroup.bind(this);
		this.getMsSiglumFormGroup = this.getMsSiglumFormGroup.bind(this);

		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onLibrarySelect = this.onLibrarySelect.bind(this);
		this.onTextInputChange = this.onTextInputChange.bind(this);
	}

	render() {
		var x: JSX.Element[] = [];
		var h = (this.state.isNew ? 'Create' : 'Edit') + ' a Manuscript';
		x.push(<Header min key="header">{h}</Header>);

		x.push(<PanelMenu key="panelMenu">
			<Button
				bsStyle="default"
				onClick={this.props.onBack}
			>Back</Button>
		</PanelMenu>);

		x.push(<Form horizontal key="form">
			{this.getCountryIDFormGroup()}

			{this.getLibSiglumFormGroup()}

			{this.getMsSiglumFormGroup()}
		</Form>);
		return x;
	}

	getCountryIDFormGroup() {
		var label, value: JSX.Element;

		if (this.state.isNew) {
			label = (<Col key="l"
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Country:</Col>);

			value = (<Col key="v" sm={4}>
				<Select
					name="countryID"
					value={this.state.opts.country}
					options={this.state.opts.countries}
					className={this.state.val.countryID === null ? '' : 'has-error'}
					onChange={this.onCountrySelect}
				/>
			</Col>);
		}
		else {
			label = (<Col key="l"
				sm={3}
				componentClass={ControlLabel}
			>Country:</Col>);

			value = (<Col key="v"
				sm={4}
				className="pt7 pl26"
			>{this.state.ents.country.country}</Col>);
		}

		return (
			<FormGroup
				controlId="countryID"
				validationState={this.state.val.countryID}
			>
				{label}
				{value}
			</FormGroup>
		);
	}

	getLibSiglumFormGroup() {
		var label, value: JSX.Element;

		if (this.state.isNew) {
			label = (<Col key="l"
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Library:</Col>);

			value = (<Col key="v" sm={4}>
				<Select
					name="libSiglum"
					value={this.state.opts.library}
					options={this.state.opts.libraries}
					className={this.state.val.countryID === null ? '' : 'has-error'}
					onChange={this.onLibrarySelect}
					disabled={!Boolean(this.state.opts.country)}
				/>
			</Col>);
		}
		else {
			label = (<Col key="l"
				sm={3}
				componentClass={ControlLabel}
			>Library:</Col>);

			value = (<Col key="v"
				sm={4}
				className="pt7 pl26"
			>{this.state.ents.library.library}</Col>);
		}

		return (
			<FormGroup
				controlId="libSiglum"
				validationState={this.state.val.libSiglum}
			>
				{label}
				{value}
			</FormGroup>
		);
	}

	getMsSiglumFormGroup() {
		var label, value: JSX.Element;

		if (this.state.isNew) {
			label = (<Col key="l"
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Manuscript Siglum:</Col>);

			value = (<Col key="v" sm={4}>
				<FormControl
					type="text"
					value={this.state.msProps.msSiglum}
					onChange={this.onTextInputChange}
				/>
			</Col>);
		}
		else {
			label = (<Col key="l"
				sm={3}
				componentClass={ControlLabel}
			>Manuscript Siglum:</Col>);

			value = (<Col key="v"
				sm={4}
				className="pt7 pl26"
			>{this.state.msProps.msSiglum}</Col>);
		}

		return (
			<FormGroup
				controlId="msSiglum"
				validationState={this.state.val.countryID}
			>
				{label}
				{value}
			</FormGroup>
		);
	}

	loadLibraries(countryID:string|boolean, callback?: (s:S)=>S) {
		if (typeof countryID === 'boolean') {
			if (!countryID) {
				return;
			}
			countryID = this.state.msProps.countryID;
		}

		if (!countryID) {
			return;
		}

		proxyFactory.getLibraryProxy().getLibraries(countryID as string, (libs, e?) => {
			if (e) {
				return alert(e);
			}

			this.setState((s:S) => {
				Library.destroyArray(s.ents.libraries);
				s.ents.libraries = libs;
				s.opts.libraries = libs.map((l) => {
					return {label:l.library, value:l.libSiglum};
				});

				if (s.isNew) {
					s.opts.library = null;
					s.ents.library = null;
					s.msProps.libSiglum = null;
				}
				else {
					s.ents.library = libs.find(l => s.msProps.libSiglum === l.libSiglum);
				}

				if (callback) return callback(s);
				return s;
			});
		})
	}

	onCountrySelect(c:Option) {
		if (c) {
			this.loadLibraries(c.value as string, (s:S) => {
				s.opts.country = c;
				s.ents.country = this.props.countries.find(ct => c.value === ct.countryID);
				return s;
			});
		}
		else {
			this.setState(s => {
				s.opts.country = null;
				s.opts.library = null;
				Library.destroyArray(s.ents.libraries);
				s.ents.library = null;
				s.msProps.libSiglum = '';
				return s;
			});
		}
	}

	onLibrarySelect(l:Option) {
		this.setState((s:S) => {
			s.opts.library = l;
			if (l) {
				s.msProps.libSiglum = l.value as string;
				s.ents.library = s.ents.libraries.find(lib => l.value === lib.libSiglum);
			}
			else {
				s.msProps.libSiglum = '';
				s.ents.library = null;
			}
			return s;
		});
	}

	onTextInputChange(e:React.FormEvent<FormControl>) {
		const target = e.target as HTMLInputElement;
		const k = target.id;
		const v = target.value;
		this.setState((s:S) => {
			s.msProps[k] = v;
			return s;
		});
	}
}
