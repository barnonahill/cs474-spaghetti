import * as React from 'react';
import {
	Button,
	Checkbox,
	Col,
	ControlLabel,
	InputGroup,
	Form,
	FormControl,
	FormGroup
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
	countries: Country[]
	msTypes: MsType[]
	manuscript: ms.Manuscript
	onBack: () => void
	onSubmit: (props: ms.Properties, isNew: boolean) => void
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
			opts: {msType: null, msTypes: msTypeOptions},
			val: {msType:null}
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
				leaves: '',
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

			if (!state.msProps.dimensions) {
				state.msProps.dimensions = '';
			}
			if (!state.msProps.binding) {
				state.msProps.binding = '';
			}
			if (!state.msProps.sourceNotes) {
				state.msProps.sourceNotes = '';
			}
			if (!state.msProps.summary) {
				state.msProps.summary = '';
			}
			if (!state.msProps.bibliography) {
				state.msProps.bibliography = '';
			}
			state.msProps.foliated = state.msProps.foliated || false;
			state.msProps.vellum = state.msProps.vellum || false;


			state.ents = {
				library: null,
				msType: p.msTypes.find(mt => state.msProps.msType === mt.msType)
			};
			state.opts.msType = {label: state.ents.msType.msTypeName, value: state.ents.msType.msType};

			var i = state.msProps.libSiglum.indexOf('-');
			var countryID = state.msProps.libSiglum.slice(0, i);
			state.ents.country = p.countries.find(c => countryID === c.countryID);
		}

		this.state = state;

		this.loadLibraries(true);
		this.loadLibraries = this.loadLibraries.bind(this);

		this.getCountryIDFormGroup = this.getCountryIDFormGroup.bind(this);
		this.getLibSiglumFormGroup = this.getLibSiglumFormGroup.bind(this);
		this.getMsSiglumFormGroup = this.getMsSiglumFormGroup.bind(this);

		this.onCheckboxChange = this.onCheckboxChange.bind(this);
		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onLibrarySelect = this.onLibrarySelect.bind(this);
		this.onMsTypeSelect = this.onMsTypeSelect.bind(this);
		this.onTextInputChange = this.onTextInputChange.bind(this);

		this.onSubmit = this.onSubmit.bind(this);
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

		x.push(<Form horizontal key="form" onSubmit={this.onSubmit}>
			{this.getCountryIDFormGroup()}

			{this.getLibSiglumFormGroup()}

			{this.getMsSiglumFormGroup()}

			<FormGroup
				controlId="msType"
				validationState={this.state.val.msType}
			>
				<Col
					sm={3}
					componentClass={ControlLabel}
					className="required"
				>Manuscript Type:</Col>
				<Col sm={4}>
					<Select
						name="countryID"
						value={this.state.opts.msType}
						options={this.state.opts.msTypes}
						className={this.state.val.msType === null ? '' : 'has-error'}
						onChange={this.onMsTypeSelect}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="dimensions">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Dimensions:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.msProps.dimensions}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="leaves">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Number of Leaves:</Col>
				<Col sm={4}>
					<FormControl
						type="number"
						value={this.state.msProps.leaves}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="foliated">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Foliated:</Col>
				<Col sm={4}>
					<Checkbox
						id="foliated"
						checked={this.state.msProps.foliated}
						onChange={this.onCheckboxChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="vellum">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Vellum:</Col>
				<Col sm={4}>
					<Checkbox
						id="vellum"
						checked={this.state.msProps.vellum}
						onChange={this.onCheckboxChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="binding">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Binding:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.msProps.binding}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="sourceNotes">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Source Notes:</Col>
				<Col sm={4}>
					<FormControl
						componentClass="textarea"
						value={this.state.msProps.sourceNotes}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="summary">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Summary:</Col>
				<Col sm={4}>
					<FormControl
						componentClass="textarea"
						value={this.state.msProps.summary}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="bibliography">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Bibliography:</Col>
				<Col sm={4}>
					<FormControl
						componentClass="textarea"
						value={this.state.msProps.bibliography}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup>
				<Col smOffset={3} sm={4}>
					<Button
						bsStyle="success"
						type="submit"
					>Save</Button>
				</Col>
			</FormGroup>
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
					className={this.state.val.libSiglum === null ? '' : 'has-error'}
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
			>{this.state.ents.library
					? this.state.ents.library.library
					: this.state.msProps.libSiglum
				}</Col>);
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
			var i = this.state.msProps.libSiglum.indexOf('-');
			countryID = this.state.msProps.libSiglum.slice(0, i);
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
					s.msProps.libSiglum = '';
				}
				else {
					s.ents.library = libs.find(l => s.msProps.libSiglum === l.libSiglum) || null;
					s.opts.library = s.opts.libraries.find(l => s.msProps.libSiglum === l.value) || null;
					if (!s.opts.library) {
						s.msProps.libSiglum = '';
					}
				}

				if (callback) return callback(s);
				return s;
			});
		})
	}

	onCheckboxChange(e: React.FormEvent<Checkbox>) {
		const target = e.target as HTMLInputElement;
		const k = target.id;
		const v = target.checked;
		this.setState(s => {
			s.msProps[k] = v;
			return s;
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

	onMsTypeSelect(mt:Option) {
		this.setState(s => {
			s.opts.msType = mt;
			if (mt) {
				s.ents.msType = this.props.msTypes.find(m => mt.value === m.msTypeName);
				s.msProps.msType = mt.value as string;
			}
			else {
				s.ents.msType = null;
				s.msProps.msType = '';
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

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		var val:any = {
			msType: this.state.msProps.msType ? null : 'error'
		};

		if (this.state.isNew) {
			val.countryID = this.state.ents.country ? null : 'error';
			val.libSiglum = this.state.msProps.libSiglum ? null : 'error';
			val.msSiglum = this.state.msProps.msSiglum ? null : 'error';
		}

		for (let k in val) {
			if (val[k] !== null) {
				return this.setState((s:S) => {
					s.val = val;
					return s;
				});
			}
		}

		// Update validation state while submit is processing
		this.setState((s:S) => {
			s.val = val;
			if (typeof s.msProps.leaves === 'string') {
				s.msProps.leaves = Number.parseInt(s.msProps.leaves);
			}
			this.props.onSubmit(s.msProps, this.state.isNew);
			return s;
		});
	}
}
