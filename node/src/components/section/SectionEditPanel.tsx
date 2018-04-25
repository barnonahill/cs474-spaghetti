// import * as React from 'react';
// import {
// 	Button,
// 	Checkbox,
// 	Col,
// 	ControlLabel,
// 	InputGroup,
// 	Form,
// 	FormControl,
// 	FormGroup
// } from 'react-bootstrap';
// import {
// 	default as Select,
// 	Options,
// 	Option
// } from 'react-select';
//
// import Header from '@src/components/common/Header.tsx';
// import PanelMenu from '@src/components/common/PanelMenu.tsx';
//
// import { Country } from '@src/models/country.ts';
// import { Library } from '@src/models/library.ts';
// import { Manuscript } from '@src/models/manuscript.ts';
// import * as sn from '@src/models/section.ts';
// // Support Entities
// import { Century } from '@src/models/century.ts';
// import { Cursus } from '@src/models/cursus.ts';
// import { SourceCompleteness } from '@src/models/sourceCompleteness.ts';
// import { Provenance } from '@src/models/provenance.ts';
// import { Notation } from '@src/models/notation.ts';
// import { MsType } from '@src/models/msType.ts';
// import proxyFactory from '@src/proxies/ProxyFactory.ts';
//
// interface P {
// 	countries: Country[]
// 	section?: sn.Section
// 	supports: {
// 		centuries: Century[]
// 		cursuses: Cursus[]
// 		srcComps: SourceCompleteness[]
// 		provs: Provenance[]
// 		notations: Notation[]
// 		msTypes: MsType[]
// 	}
// 	onBack: () => void
// 	onSubmit: (props: sn.Properties, isNew: boolean) => void
// 	loadSections: (libSiglum:string, msSiglum:string, callback: (s:sn.Section[]) => void) => void
// }
// interface S {
// 	isNew: boolean
// 	snProps: sn.Properties
// 	val?: {
// 		countryID: any
// 		libSiglum: any
// 		msSiglum: any
// 		sectionID: any
// 	}
// 	opts: {
// 		country?: Option
// 		countries?: Options
// 		library?: Option
// 		libraries?: Options
// 		manuscript?: Option
// 		manuscripts?: Options
// 		century: Option
// 		centuries: Options
// 		cursus: Option
// 		cursuses: Options
// 		srcComp: Option
// 		srcComps: Options
// 		prov: Option
// 		provs: Options
// 		notation: Option
// 		notations: Options
// 		msType: Option
// 		msTypes: Options
// 	}
// }
//
// export default class ManuscriptEditPanel extends React.Component<P,S> {
// 	constructor(p:P) {
// 		super(p);
//
// 		var msTypeOptions = p.supports.msTypes.map((m:MsType) => {
// 			return {label: m.msTypeName, value: m.msType};
// 		});
//
// 		var isNew = !Boolean(p.section);
// 		var state: Partial<S> = {
// 			isNew: isNew,
// 			opts: {
// 				country: null,
// 				countries: p.countries.map(c => {
// 					return {label:c.country, value:c.countryID};
// 				}),
//
// 				century: null,
// 				centuries: p.supports.centuries.map(c => {
// 					return {label: c.centuryName, value: c.centuryID}
// 				}),
//
// 				cursus: null,
// 				cursuses: p.supports.cursuses.map(c => {
// 					return {label: c.cursusName, value: c.cursusID}
// 				}),
//
// 				srcComp: null,
// 				srcComps: p.supports.srcComps.map(s => {
// 					return {label: s.sourceCompletenessName, value: s.sourceCompletenessID}
// 				}),
//
// 				prov: null,
// 				provs: p.supports.provs.map(p => {
// 					return {label: p.provenanceName || p.provenanceID, value: p.provenanceID}
// 				}),
//
// 				notation: null,
// 				notations: p.supports.notations.map(s => {
// 					return {label: s.notationName, value: s.notationID}
// 				}),
//
// 				msType: null,
// 				msTypes: p.supports.msTypes.map((m:MsType) => {
// 					return {label: m.msTypeName, value: m.msType};
// 				})},
// 		};
//
// 		if (isNew) {
// 			state.snProps = {
// 				libSiglum: '',
// 				msSiglum: '',
// 				sectionID: 0,
// 				sectionType: '',
// 				liturgicalOccasion: '',
// 				notationID: '',
// 				numGatherings: 0,
// 				numColumns: 0,
// 				linesPerColumn: 0,
// 				scribe: '',
// 				date: '',
// 				centuryID: '',
// 				cursusID: '',
// 				provenanceID: '',
// 				provenanceDetail: '',
// 				commissioner: '',
// 				inscription: '',
// 				colophon: '',
// 				sourceCompletenessID: ''
// 			};
//
// 			state.val = {
// 				countryID: null,
// 				libSiglum: null,
// 				msSiglum: null,
// 				sectionID: null
// 			};
//
//
// 		}
// 		// Edit mode
// 		else {
// 			state.snProps = p.section.toProperties();
//
// 			state.snProps.sectionType = state.snProps.sectionType || '';
// 			state.snProps.liturgicalOccasion = state.snProps.liturgicalOccasion || '';
// 			state.snProps.notationID = state.snProps.notationID || '';
// 			state.snProps.numGatherings = state.snProps.numGatherings || 0;
// 			state.snProps.numColumns = state.snProps.numColumns || 0;
// 			state.snProps.linesPerColumn = state.snProps.linesPerColumn || 0;
// 			state.snProps.scribe = state.snProps.scribe || '';
// 			state.snProps.date = state.snProps.date || '';
// 			state.snProps.centuryID = state.snProps.centuryID || '';
// 			state.snProps.cursusID = state.snProps.cursusID || '';
// 			state.snProps.provenanceID = state.snProps.provenanceID || '';
// 			state.snProps.provenanceDetail = state.snProps.provenanceDetail || '';
// 			state.snProps.commissioner = state.snProps.commissioner || '';
// 			state.snProps.inscription = state.snProps.inscription || '';
// 			state.snProps.colophon = state.snProps.colophon || '';
// 			state.snProps.sourceCompletenessID = state.snProps.sourceCompletenessID || '';
//
// 			if (state.snProps.centuryID) {
// 				state.opts.century = state.opts.centuries
// 					.map((c:Option) => state.snProps.centuryID === c.value);
// 			}
// 			if (state.snProps.cursusID) {
// 				state.opts.cursus = state.opts.cursuses
// 					.map((c:Option) => state.snProps.cursusID === c.value);
// 			}
// 			if (state.snProps.provenanceID) {
// 				state.opts.prov = state.opts.provs
// 					.map((p:Option) => state.snProps.provenanceID === p.value);
// 			}
// 			if (state.snProps.notationID) {
// 				state.opts.notation = state.opts.notations
// 					.map((n:Option) => state.snProps.notationID === n.value);
// 			}
// 			if (state.snProps.sourceCompletenessID) {
// 				state.opts.srcComp = state.opts.srcComps
// 					.map((s:Option) => state.snProps.sourceCompletenessID === s.value);
// 			}
// 		}
//
// 		this.state = state as S;
//
// 		this.loadLibraries(true);
// 		this.loadLibraries = this.loadLibraries.bind(this);
//
// 		this.getCountryIDFormGroup = this.getCountryIDFormGroup.bind(this);
// 		this.getLibSiglumFormGroup = this.getLibSiglumFormGroup.bind(this);
// 		this.getMsSiglumFormGroup = this.getMsSiglumFormGroup.bind(this);
// 		this.getSectionIDFormGroup = this.getSectionIDFormGroup.bind(this);
//
// 		this.onCountrySelect = this.onCountrySelect.bind(this);
// 		this.onLibrarySelect = this.onLibrarySelect.bind(this);
// 		this.onManuscriptSelect = this.onManuscriptSelect.bind(this);
//
// 		this.onSectionTypeSelect = this.onSectionTypeSelect.bind(this);
// 		this.onCenturySelect = this.onCenturySelect.bind(this);
// 		this.onCursusSelect = this.onCursusSelect.bind(this);
// 		this.onProvSelect = this.onProvSelect.bind(this);
// 		this.onNotationSelect = this.onNotationSelect.bind(this);
// 		this.onSrcCompSelect = this.onSrcCompSelect.bind(this);
//
// 		this.onTextInputChange = this.onTextInputChange.bind(this);
//
// 		this.onSubmit = this.onSubmit.bind(this);
// 	}
//
// 	render() {
// 		var x: JSX.Element[] = [];
// 		var h = (this.state.isNew ? 'Create' : 'Edit') + ' a Manuscript';
// 		x.push(<Header min key="header">{h}</Header>);
//
// 		x.push(<PanelMenu key="panelMenu">
// 			<Button
// 				bsStyle="default"
// 				onClick={this.props.onBack}
// 			>Back</Button>
// 		</PanelMenu>);
//
// 		x.push(<Form horizontal key="form" onSubmit={this.onSubmit}>
// 			{this.getCountryIDFormGroup()}
//
// 			{this.getLibSiglumFormGroup()}
//
// 			{this.getMsSiglumFormGroup()}
//
// 			{this.getSectionIDFormGroup()}
//
// 			<FormGroup
// 				controlId="sectionType"
// 			>
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Section Type:</Col>
// 				<Col sm={4}>
// 					<Select
// 						name="sectionType"
// 						value={this.state.opts.msType}
// 						options={this.state.opts.msTypes}
// 						onChange={this.onSectionTypeSelect}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="liturgicalOccasion">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Liturgical Occasion:</Col>
// 				<Col sm={4}>
// 					<FormControl
// 						componentClass="textarea"
// 						value={this.state.snProps.liturgicalOccasion}
// 						onChange={this.onTextInputChange}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="notationID">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Notation:</Col>
// 				<Col sm={4}>
// 					<Select
// 						name="notationID"
// 						value={this.state.opts.notation}
// 						options={this.state.opts.notations}
// 						onChange={this.onNotationSelect}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="numGatherings">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Number of Gatherings:</Col>
// 				<Col sm={4}>
// 					<FormControl
// 						type="number"
// 						value={this.state.snProps.numGatherings}
// 						onChange={this.onTextInputChange}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="numColumns">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Number of Columns:</Col>
// 				<Col sm={4}>
// 					<FormControl
// 						type="number"
// 						value={this.state.snProps.numColumns}
// 						onChange={this.onTextInputChange}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="linesPerColumn">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Number of Lines per Column:</Col>
// 				<Col sm={4}>
// 					<FormControl
// 						type="number"
// 						value={this.state.snProps.linesPerColumn}
// 						onChange={this.onTextInputChange}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="scribe">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Scribe:</Col>
// 				<Col sm={4}>
// 					<FormControl
// 						type="text"
// 						value={this.state.snProps.scribe}
// 						onChange={this.onTextInputChange}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="date">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Date:</Col>
// 				<Col sm={4}>
// 					<FormControl
// 						type="text"
// 						value={this.state.snProps.date}
// 						onChange={this.onTextInputChange}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="centuryID">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Century:</Col>
// 				<Col sm={4}>
// 					<Select
// 						name="centuryID"
// 						value={this.state.opts.century}
// 						options={this.state.opts.centuries}
// 						onChange={this.onCenturySelect}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="cursusID">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Cursus:</Col>
// 				<Col sm={4}>
// 					<Select
// 						name="cursusID"
// 						value={this.state.opts.cursus}
// 						options={this.state.opts.cursuses}
// 						onChange={this.onCursusSelect}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="provenanceID">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Provenance:</Col>
// 				<Col sm={4}>
// 					<Select
// 						name="provenanceID"
// 						value={this.state.opts.prov}
// 						options={this.state.opts.provs}
// 						onChange={this.onProvSelect}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="provenanceDetail">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Provenance Details:</Col>
// 				<Col sm={4}>
// 					<FormControl
// 						type="text"
// 						value={this.state.snProps.provenanceDetail}
// 						onChange={this.onTextInputChange}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="commissioner">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Commissioner:</Col>
// 				<Col sm={4}>
// 					<FormControl
// 						type="text"
// 						value={this.state.snProps.commissioner}
// 						onChange={this.onTextInputChange}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="inscription">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Inscription:</Col>
// 				<Col sm={4}>
// 					<FormControl
// 						componentClass="textarea"
// 						value={this.state.snProps.inscription}
// 						onChange={this.onTextInputChange}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="colophon">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Colophon:</Col>
// 				<Col sm={4}>
// 					<FormControl
// 						componentClass="textarea"
// 						value={this.state.snProps.colophon}
// 						onChange={this.onTextInputChange}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup controlId="sourceCompletenessID">
// 				<Col
// 					sm={3}
// 					componentClass={ControlLabel}
// 				>Source Completeness:</Col>
// 				<Col sm={4}>
// 					<Select
// 						name="sourceCompletenessID"
// 						value={this.state.opts.srcComp}
// 						options={this.state.opts.srcComps}
// 						onChange={this.onSrcCompSelect}
// 					/>
// 				</Col>
// 			</FormGroup>
//
// 			<FormGroup>
// 				<Col smOffset={3} sm={4}>
// 					<Button
// 						bsStyle="success"
// 						type="submit"
// 					>Save</Button>
// 				</Col>
// 			</FormGroup>
// 		</Form>);
// 		return x;
// 	}
//
// 	getCountryIDFormGroup() {
// 		var label, value: JSX.Element;
//
// 		if (this.state.isNew) {
// 			label = (<Col key="l"
// 				sm={3}
// 				componentClass={ControlLabel}
// 				className="required"
// 			>Country:</Col>);
//
// 			value = (<Col key="v" sm={4}>
// 				<Select
// 					name="countryID"
// 					value={this.state.opts.country}
// 					options={this.state.opts.countries}
// 					className={this.state.val.countryID === null ? '' : 'has-error'}
// 					onChange={this.onCountrySelect}
// 				/>
// 			</Col>);
// 		}
// 		else {
// 			label = (<Col key="l"
// 				sm={3}
// 				componentClass={ControlLabel}
// 			>Country:</Col>);
//
// 			value = (<Col key="v"
// 				sm={4}
// 				className="pt7 pl27"
// 			>{this.state.opts.country.label}</Col>);
// 		}
//
// 		return (
// 			<FormGroup
// 				controlId="countryID"
// 				validationState={this.state.val.countryID}
// 			>
// 				{label}
// 				{value}
// 			</FormGroup>
// 		);
// 	}
//
// 	getLibSiglumFormGroup() {
// 		var label, value: JSX.Element;
//
// 		if (this.state.isNew) {
// 			label = (<Col key="l"
// 				sm={3}
// 				componentClass={ControlLabel}
// 				className="required"
// 			>Library:</Col>);
//
// 			value = (<Col key="v" sm={4}>
// 				<Select
// 					name="libSiglum"
// 					value={this.state.opts.library}
// 					options={this.state.opts.libraries}
// 					className={this.state.val.libSiglum === null ? '' : 'has-error'}
// 					onChange={this.onLibrarySelect}
// 					disabled={!Boolean(this.state.opts.country)}
// 				/>
// 			</Col>);
// 		}
// 		else {
// 			label = (<Col key="l"
// 				sm={3}
// 				componentClass={ControlLabel}
// 			>Library:</Col>);
//
// 			value = (<Col key="v"
// 				sm={4}
// 				className="pt7 pl27"
// 			>{this.state.opts.library.label}</Col>);
// 		}
//
// 		return (
// 			<FormGroup
// 				controlId="libSiglum"
// 				validationState={this.state.val.libSiglum}
// 			>
// 				{label}
// 				{value}
// 			</FormGroup>
// 		);
// 	}
//
// 	getMsSiglumFormGroup() {
// 		var label, value: JSX.Element;
//
// 		if (this.state.isNew) {
// 			label = (<Col key="l"
// 				sm={3}
// 				componentClass={ControlLabel}
// 				className="required"
// 			>Manuscript Siglum:</Col>);
//
// 			value = (<Col key="v" sm={4}>
// 				<Select
// 					name="msSiglum"
// 					value={this.state.opts.manuscript}
// 					options={this.state.opts.manuscripts}
// 					className={this.state.val.msSiglum === null ? '' : 'has-error'}
// 					onChange={this.onManuscriptSelect}
// 					disabled={!Boolean(this.state.opts.library)}
// 				/>
// 			</Col>);
// 		}
// 		else {
// 			label = (<Col key="l"
// 				sm={3}
// 				componentClass={ControlLabel}
// 			>Manuscript Siglum:</Col>);
//
// 			value = (<Col key="v"
// 				sm={4}
// 				className="pt7 pl27"
// 			>{this.state.snProps.msSiglum}</Col>);
// 		}
//
// 		return (
// 			<FormGroup
// 				controlId="msSiglum"
// 				validationState={this.state.val.countryID}
// 			>
// 				{label}
// 				{value}
// 			</FormGroup>
// 		);
// 	}
//
// 	getSectionIDFormGroup() {
// 		var label, value: JSX.Element;
// 		if (this.state.isNew) {
// 			label = (<Col key="l"
// 				sm={3}
// 				componentClass={ControlLabel}
// 				className="required"
// 			>Section ID:</Col>);
//
// 			value = (<Col sm={4}>
// 				<FormControl
// 					type="text"
// 					value={this.state.snProps.sectionID}
// 					onChange={this.onTextInputChange}
// 				/>
// 			</Col>);
// 		}
// 		else {
// 			label = (<Col key="l"
// 				sm={3}
// 				componentClass={ControlLabel}
// 			>Section ID:</Col>);
//
// 			value = (<Col key="v"
// 				sm={4}
// 				className="pt7 pl27"
// 			>{this.state.snProps.sectionID}</Col>);
// 		}
//
// 		return (
// 			<FormGroup
// 				controlId="sectionID"
// 				validationState={this.state.val.sectionID}
// 			>
// 				{label}
// 				{value}
// 			</FormGroup>
// 		);
// 	}
//
// 	loadLibraries(countryID:string|boolean, callback?: ()=>void) {
// 		if (typeof countryID === 'boolean') {
// 			if (!countryID) {
// 				return;
// 			}
// 			var i = this.state.snProps.libSiglum.indexOf('-');
// 			countryID = this.state.snProps.libSiglum.slice(0, i);
// 		}
//
// 		if (!countryID) {
// 			return;
// 		}
//
// 		proxyFactory.getLibraryProxy().getLibraries(countryID as string, (libs, e?) => {
// 			if (e) {
// 				return alert(e);
// 			}
//
// 			this.setState((s:S) => {
// 				s.opts.libraries = libs.map((l) => {
// 					return {label:l.library, value:l.libSiglum};
// 				});
//
// 				if (s.isNew) {
// 					s.opts.library = null;
// 					s.snProps.libSiglum = '';
// 				}
// 				else {
// 					s.opts.library = s.opts.libraries.find(l => s.snProps.libSiglum === l.value) || null;
// 					if (!s.opts.library) {
// 						s.snProps.libSiglum = '';
// 					}
// 				}
//
// 				if (callback) return callback(s);
// 				return s;
// 			});
// 		})
// 	}
//
// 	loadManuscripts(libSiglum: string, callback: (ms:Manuscript[]) => void) {
// 		proxyFactory.getManuscriptProxy().getManuscripts(null, libSiglum, (ms, e?) => {
// 			if (e) {
// 				return alert(e);
// 			}
//
// 			this.setState((s:S) => {
// 				s.opts.manuscripts = ms.map(m => {
// 					return {label: m.msSiglum, value: m.msSiglum};
// 				});
//
// 				if (!this.state.isNew) {
// 					s.opts.manuscript = s.opts.manuscript.find((m:Option) => s.snProps.msSiglum === m.value);
// 				}
// 				return s;
// 			});
// 		});
// 	}
//
// 	onCountrySelect(c:Option) {
// 		if (c) {
// 			this.loadLibraries(c.value as string, (s:S) => {
// 				s.opts.country = c;
// 				return s;
// 			});
// 		}
// 		else {
// 			this.setState(s => {
// 				s.opts.country = null;
// 				s.opts.library = null;
// 				s.snProps.libSiglum = '';
// 				return s;
// 			});
// 		}
// 	}
//
// 	onLibrarySelect(l:Option) {
// 		this.setState((s:S) => {
// 			s.opts.library = l;
// 			if (l) {
// 				s.snProps.libSiglum = l.value as string;
// 			}
// 			else {
// 				s.snProps.libSiglum = '';
// 			}
// 			s.opts.manuscript = null;
// 			return s;
// 		});
//
// 		if (l) {
// 			this.loadManuscripts(l.value as string, ms => {
// 				this.setState((s:S) => {
// 					s.opts.manuscripts = ms.map(m => {
// 						return {label: m.msSiglum, value: m.msSiglum};
// 					});
// 					return s;
// 				});
// 			});
// 		}
// 		else {
//
// 		}
//
// 	}
//
// 	onManuscriptSelect(o:Option) {
// 		this.setState((s:S) => {
// 			s.opts.manuscript = o;
// 			s.snProps.manuscript = o ? o.value as string: '';
// 			return s;
// 		});
// 	}
//
// 	onSectionTypeSelect(mt:Option) {
// 		this.setState(s => {
// 			s.opts.msType = mt;
// 			if (mt) {
// 				s.snProps.sectionType = mt.value as string;
// 			}
// 			else {
// 				s.snProps.sectionType = '';
// 			}
// 			return s;
// 		});
// 	}
//
// 	onCenturySelect(o:Option) {
// 		this.setState((s:S) => {
// 			s.opts.century = o;
// 			s.snProps.centuryID = o ? o.value as string : '';
// 			return s;
// 		});
// 	}
//
// 	onCursusSelect(o:Option) {
// 		this.setState((s:S) => {
// 			s.opts.cursus = o;
// 			s.snProps.cursusID = o ? o.value as string : '';
// 			return s;
// 		});
// 	}
//
// 	onSrcCompSelect(o:Option) {
// 		this.setState((s:S) => {
// 			s.opts.srcComp = o;
// 			s.snProps.sourceCompletenessID = o ? o.value as string : '';
// 			return s;
// 		});
// 	}
//
// 	onProvSelect(o:Option) {
// 		this.setState((s:S) => {
// 			s.opts.prov = o;
// 			s.snProps.provenanceID = o ? o.value as string : '';
// 			return s;
// 		});
// 	}
//
// 	onNotationSelect(o:Option) {
// 		this.setState((s:S) => {
// 			s.opts.notation = o;
// 			s.snProps.notationID= o ? o.value as string : '';
// 			return s;
// 		});
// 	}
//
// 	onTextInputChange(e:React.FormEvent<FormControl>) {
// 		const target = e.target as HTMLInputElement;
// 		const k = target.id;
// 		const v = target.value;
// 		this.setState((s:S) => {
// 			s.snProps[k] = v;
// 			return s;
// 		});
// 	}
//
// 	onSubmit(e:React.FormEvent<Form>) {
// 		e.preventDefault();
//
// 		if (this.state.isNew) {
// 			var val:any = {
// 				countryID: this.state.opts.country ? null : 'error',
// 				libSiglum: this.state.snProps.libSiglum ? null : 'error',
// 				msSiglum: this.state.snProps.msSiglum ? null : 'error',
// 				sectionID: this.state.snProps.sectionID ? null : 'error'
// 			};
//
// 			for (let k in val) {
// 				if (val[k] !== null) {
// 					return this.setState((s:S) => {
// 						s.val = val;
// 						return s;
// 					});
// 				}
// 			}
// 		}
//
//
//
// 		// Update validation state while submit is processing
// 		this.setState((s:S) => {
// 			s.val = val;
//
// 			if (typeof s.snProps.numGatherings === 'string') {
// 				s.snProps.leaves = Number.parseInt(s.snProps.numGatherings);
// 			}
// 			if (typeof s.snProps.numColumns === 'string') {
// 				s.snProps.leaves = Number.parseInt(s.snProps.numColumns);
// 			}
// 			if (typeof s.snProps.linesPerColumn === 'string') {
// 				s.snProps.leaves = Number.parseInt(s.snProps.linesPerColumn);
// 			}
//
// 			this.props.onSubmit(s.snProps, this.state.isNew);
// 			return s;
// 		});
// 	}
// }
