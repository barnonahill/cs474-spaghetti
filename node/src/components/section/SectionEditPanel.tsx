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

// Common components
import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';

// Primary entities
import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import { Manuscript } from '@src/models/manuscript.ts';
import * as sn from '@src/models/section.ts';

// Support Entities
import { Century } from '@src/models/century.ts';
import { Cursus } from '@src/models/cursus.ts';
import { SourceCompleteness } from '@src/models/sourceCompleteness.ts';
import { Provenance } from '@src/models/provenance.ts';
import { Notation } from '@src/models/notation.ts';
import { MsType } from '@src/models/msType.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

/**
 * Models of Parent Entities, filled in constructor for existing sections,
 * or if filtered for new sections.
 */
interface StateParents {
	country: Country
	library: Library
	manuscript: Manuscript
}

interface StatePossibleParents {
	countries: Country[]
	libraries: Library[] // async load
	manuscripts: Manuscript[] // async load
}

interface PrimaryOptions {
	country: Option
	countries: Options
	library: Option
	libraries: Options
	manuscript: Option
	manuscripts: Options
}

interface SupportOptions {
	century: Option
	centuries: Options
	cursus: Option
	cursuses: Options
	srcComp: Option
	srcComps: Options
	prov: Option
	provs: Options
	notation: Option
	notations: Options
	secType: Option
	secTypes: Options
}

/**
 * Validation state of required inputs, only needed for new sections.
 */
interface StateVal {
	countryID: any
	libSiglum: any
	msSiglum: any
	sectionID: any
	[x:string]: any;
}

interface P {
	onBack: () => void
	onSubmit: (snProps: sn.Properties, isNew: boolean) => void

	// Entity loaders, used for new sections if table was not filtered.
	loadLibraries: (countryID: string, callback: (libraries: Library[]) => void) => void
	loadManuscripts: (libSiglum: string, callback: (manuscripts: Manuscript[]) => void) => void

	primaries: {
		// All three are loaded if section already exists or table was filtered.
		country?: Country // country of section (new or not)
		library?: Library // library of section (new or not)
		manuscript?: Manuscript // manuscript of section (new or not)

		section?: sn.Section // section being edited or null for new section

		countries: Country[]
		libraries?: Library[] // libraries for primary country, if filtered
		manuscripts?: Manuscript[] // manuscripts for primary library, if filtered
	}

	supports: {
		centuries: Century[]
		cursuses: Cursus[]
		srcComps: SourceCompleteness[]
		provs: Provenance[]
		notations: Notation[]
		msTypes: MsType[]
	}

	// Parent entities of existing section, if table was not filtered.
	temps: {
		country?: Country
		library?: Library
		manuscript?: Manuscript
	}
}

interface S {
	isNew: boolean
	snProps: sn.Properties

	parents: StateParents
	possibleParents?: StatePossibleParents

	// new
	val?: StateVal

	// react-select options, optionals are for new sections
	opts: {
		p?: PrimaryOptions
		s: SupportOptions
	}
}

export default class ManuscriptEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		// Set up support select options
		var sOpts: SupportOptions = {
			century: null,
			centuries: p.supports.centuries.map(c => {
				return {label: c.centuryName, value: c.centuryID}
			}),

			cursus: null,
			cursuses: p.supports.cursuses.map(c => {
				return {label: c.cursusName, value: c.cursusID}
			}),

			srcComp: null,
			srcComps: p.supports.srcComps.map(s => {
				return {label: s.sourceCompletenessName, value: s.sourceCompletenessID}
			}),

			prov: null,
			provs: p.supports.provs.map(p => {
				return {label: p.provenanceName || p.provenanceID, value: p.provenanceID}
			}),

			notation: null,
			notations: p.supports.notations.map(s => {
				return {label: s.notationName, value: s.notationID}
			}),

			secType: null,
			secTypes: p.supports.msTypes.map((m:MsType) => {
				return {label: m.msTypeName, value: m.msType};
			}),
		};

		// Determine initial state of the panel
		var isNew = !Boolean(p.primaries.section);
		var isFiltered = Boolean(p.primaries.manuscript);

		var parents: StateParents = {
			country: p.temps.country || p.primaries.country,
			library: p.temps.library || p.primaries.library,
			manuscript: p.temps.manuscript || p.primaries.manuscript
		};

		var state: Partial<S> = {
			isNew: isNew,
			// snProps filled in conditional below
			parents: parents,
			opts: {
				s: sOpts
			},
			val: {
				countryID: null,
				libSiglum: null,
				msSiglum: null,
				sectionID: null
			}
		};


		if (isNew) {
			// Create mode

			state.possibleParents = {
				countries: p.primaries.countries,
				libraries: p.primaries.libraries || null, // from filter
				manuscripts: p.primaries.manuscripts || null // from filter
			};

			state.snProps = {
				libSiglum: '',
				msSiglum: '',
				sectionID: 0,
				sectionType: '',
				liturgicalOccasion: '',
				notationID: '',
				numGatherings: 0,
				numColumns: 0,
				linesPerColumn: 0,
				scribe: '',
				date: '',
				centuryID: '',
				cursusID: '',
				provenanceID: '',
				provenanceDetail: '',
				commissioner: '',
				inscription: '',
				colophon: '',
				sourceCompletenessID: ''
			};

			var primaryOptions: Partial<PrimaryOptions> = {
				countries: state.possibleParents.countries.map(c => {
					return {label: c.country, value: c.countryID};
				})
			};

			if (isFiltered) {
				// Provide some initial values
				state.snProps.libSiglum = parents.manuscript.libSiglum
				state.snProps.msSiglum = parents.manuscript.msSiglum

				primaryOptions.libraries = state.possibleParents.libraries.map(l => {
					return {label: l.library, value: l.libSiglum}
				});

				primaryOptions.manuscripts = state.possibleParents.manuscripts.map(m => {
					return {label: m.msSiglum, value: m.msSiglum};
				});

				primaryOptions.country = primaryOptions.countries
					.find(o => state.parents.country.countryID === o.value);

				primaryOptions.library = primaryOptions.libraries
					.find(o => state.parents.library.libSiglum === o.value);

				primaryOptions.manuscript = primaryOptions.manuscripts
					.find(o => state.parents.manuscript.msSiglum === o.value);
			}
			else {
				// No filter, no pre-loaded options. User has to select a country to load them.
				primaryOptions.libraries = null;
				primaryOptions.manuscripts = null;
				primaryOptions.country = null;
				primaryOptions.library = null;
				primaryOptions.manuscript = null;
			}
			// We've fleshed out the interface, this cast is okay.
			state.opts.p = primaryOptions as PrimaryOptions;

		}

		else {
			// Edit mode
			state.snProps = p.primaries.section.toProperties();

			// Make sure we have values for all our inputs, the back-end won't send null keys
			state.snProps.sectionType = state.snProps.sectionType || '';
			state.snProps.liturgicalOccasion = state.snProps.liturgicalOccasion || '';
			state.snProps.notationID = state.snProps.notationID || '';
			state.snProps.numGatherings = state.snProps.numGatherings || 0;
			state.snProps.numColumns = state.snProps.numColumns || 0;
			state.snProps.linesPerColumn = state.snProps.linesPerColumn || 0;
			state.snProps.scribe = state.snProps.scribe || '';
			state.snProps.date = state.snProps.date || '';
			state.snProps.centuryID = state.snProps.centuryID || '';
			state.snProps.cursusID = state.snProps.cursusID || '';
			state.snProps.provenanceID = state.snProps.provenanceID || '';
			state.snProps.provenanceDetail = state.snProps.provenanceDetail || '';
			state.snProps.commissioner = state.snProps.commissioner || '';
			state.snProps.inscription = state.snProps.inscription || '';
			state.snProps.colophon = state.snProps.colophon || '';
			state.snProps.sourceCompletenessID = state.snProps.sourceCompletenessID || '';

			// Fill in select values based on the attributes inside the Section
			if (state.snProps.centuryID) {
				state.opts.s.century = state.opts.s.centuries
					.find((c:Option) => state.snProps.centuryID === c.value);
			}
			if (state.snProps.cursusID) {
				state.opts.s.cursus = state.opts.s.cursuses
					.find((c:Option) => state.snProps.cursusID === c.value);
			}
			if (state.snProps.provenanceID) {
				state.opts.s.prov = state.opts.s.provs
					.find((p:Option) => state.snProps.provenanceID === p.value);
			}
			if (state.snProps.notationID) {
				state.opts.s.notation = state.opts.s.notations
					.find((n:Option) => state.snProps.notationID === n.value);
			}
			if (state.snProps.sourceCompletenessID) {
				state.opts.s.srcComp = state.opts.s.srcComps
					.find((s:Option) => state.snProps.sourceCompletenessID === s.value);
			}
			if (state.snProps.sectionType) {
				state.opts.s.secType = state.opts.s.secTypes
					.find(s => state.snProps.sectionType === s.value);
			}
		}
		// We've fleshed out the interface, this cast is okay.
		this.state = state as S;

		// Bind our conditional JSX element getters
		this.getCountryIDFormGroup = this.getCountryIDFormGroup.bind(this);
		this.getLibSiglumFormGroup = this.getLibSiglumFormGroup.bind(this);
		this.getMsSiglumFormGroup = this.getMsSiglumFormGroup.bind(this);
		this.getSectionIDFormGroup = this.getSectionIDFormGroup.bind(this);

		// Bind our primary select handlers
		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onLibrarySelect = this.onLibrarySelect.bind(this);
		this.onManuscriptSelect = this.onManuscriptSelect.bind(this);

		// Bind our support select handlers
		this.onSectionTypeSelect = this.onSectionTypeSelect.bind(this);
		this.onCenturySelect = this.onCenturySelect.bind(this);
		this.onCursusSelect = this.onCursusSelect.bind(this);
		this.onProvSelect = this.onProvSelect.bind(this);
		this.onNotationSelect = this.onNotationSelect.bind(this);
		this.onSrcCompSelect = this.onSrcCompSelect.bind(this);

		// Bind text input and form submit handlers
		this.onTextInputChange = this.onTextInputChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		var x: JSX.Element[] = [];
		var h = (this.state.isNew
			? 'Create a Section'
			: 'Edit Section #' + this.state.snProps.sectionID + ': '
				+ this.state.snProps.msSiglum + ', ' + this.state.parents.library.library);
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

			{this.getSectionIDFormGroup()}

			<FormGroup
				controlId="sectionType"
			>
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Section Type:</Col>
				<Col sm={4}>
					<Select
						name="sectionType"
						value={this.state.opts.s.secType}
						options={this.state.opts.s.secTypes}
						onChange={this.onSectionTypeSelect}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="liturgicalOccasion">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Liturgical Occasion:</Col>
				<Col sm={4}>
					<FormControl
						componentClass="textarea"
						value={this.state.snProps.liturgicalOccasion}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="notationID">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Notation:</Col>
				<Col sm={4}>
					<Select
						name="notationID"
						value={this.state.opts.s.notation}
						options={this.state.opts.s.notations}
						onChange={this.onNotationSelect}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="numGatherings">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Number of Gatherings:</Col>
				<Col sm={4}>
					<FormControl
						type="number"
						value={this.state.snProps.numGatherings}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="numColumns">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Number of Columns:</Col>
				<Col sm={4}>
					<FormControl
						type="number"
						value={this.state.snProps.numColumns}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="linesPerColumn">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Number of Lines per Column:</Col>
				<Col sm={4}>
					<FormControl
						type="number"
						value={this.state.snProps.linesPerColumn}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="scribe">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Scribe:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.snProps.scribe}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="date">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Date:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.snProps.date}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="centuryID">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Century:</Col>
				<Col sm={4}>
					<Select
						name="centuryID"
						value={this.state.opts.s.century}
						options={this.state.opts.s.centuries}
						onChange={this.onCenturySelect}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="cursusID">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Cursus:</Col>
				<Col sm={4}>
					<Select
						name="cursusID"
						value={this.state.opts.s.cursus}
						options={this.state.opts.s.cursuses}
						onChange={this.onCursusSelect}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="provenanceID">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Provenance:</Col>
				<Col sm={4}>
					<Select
						name="provenanceID"
						value={this.state.opts.s.prov}
						options={this.state.opts.s.provs}
						onChange={this.onProvSelect}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="provenanceDetail">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Provenance Details:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.snProps.provenanceDetail}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="commissioner">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Commissioner:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.snProps.commissioner}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="inscription">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Inscription:</Col>
				<Col sm={4}>
					<FormControl
						componentClass="textarea"
						value={this.state.snProps.inscription}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="colophon">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Colophon:</Col>
				<Col sm={4}>
					<FormControl
						componentClass="textarea"
						value={this.state.snProps.colophon}
						onChange={this.onTextInputChange}
					/>
				</Col>
			</FormGroup>

			<FormGroup controlId="sourceCompletenessID">
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Source Completeness:</Col>
				<Col sm={4}>
					<Select
						name="sourceCompletenessID"
						value={this.state.opts.s.srcComp}
						options={this.state.opts.s.srcComps}
						onChange={this.onSrcCompSelect}
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
					value={this.state.opts.p.country}
					options={this.state.opts.p.countries}
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
				className="pt7 pl27"
			>{this.state.parents.country.country}</Col>);
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
					value={this.state.opts.p.library}
					options={this.state.opts.p.libraries}
					className={this.state.val.libSiglum === null ? '' : 'has-error'}
					onChange={this.onLibrarySelect}
					disabled={!this.state.opts.p.country}
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
				className="pt7 pl27"
			>{this.state.parents.library.library}</Col>);
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
				<Select
					name="msSiglum"
					value={this.state.opts.p.manuscript}
					options={this.state.opts.p.manuscripts}
					className={this.state.val.msSiglum === null ? '' : 'has-error'}
					onChange={this.onManuscriptSelect}
					disabled={!this.state.opts.p.library}
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
				className="pt7 pl27"
			>{this.state.snProps.msSiglum}</Col>);
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

	getSectionIDFormGroup() {
		var label, value: JSX.Element;
		if (this.state.isNew) {
			label = (<Col key="l"
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Section ID:</Col>);

			value = (<Col sm={4}>
				<FormControl
					type="text"
					value={this.state.snProps.sectionID}
					onChange={this.onTextInputChange}
				/>
			</Col>);
		}
		else {
			label = (<Col key="l"
				sm={3}
				componentClass={ControlLabel}
			>Section ID:</Col>);

			value = (<Col key="v"
				sm={4}
				className="pt7 pl27"
			>{this.state.snProps.sectionID}</Col>);
		}

		return (
			<FormGroup
				controlId="sectionID"
				validationState={this.state.val.sectionID}
			>
				{label}
				{value}
			</FormGroup>
		);
	}

	onCountrySelect(o:Option) {
		var wipeManuscript = (s:S) => {
			// Don't destroy data passed from props
			if (this.props.primaries.manuscripts !== s.possibleParents.manuscripts) {
				Manuscript.destroyArray(s.possibleParents.manuscripts);
			}
			s.parents.manuscript = null;
			s.opts.p.manuscript = null;
			s.snProps.msSiglum = '';
		};

		var wipeLibrary = (s:S) => {
			// Don't destroy data passed from props
			if (this.props.primaries.libraries !== s.possibleParents.libraries) {
				Library.destroyArray(s.possibleParents.libraries);
			}

			s.parents.library = null;
			s.opts.p.library = null;
			s.snProps.libSiglum = '';
			wipeManuscript(s);
		};

		var wipeCountry = (s:S) => {
			s.opts.p.country = null;
			wipeLibrary(s);
		}

		if (o) {
			this.props.loadLibraries(o.value as string, libraries => {
				this.setState(s => {
					wipeLibrary(s);

					s.possibleParents.libraries = libraries;
					s.opts.p.libraries = libraries.map(l => {
						return {label: l.library, value: l.libSiglum};
					});
					return s;
				});
			});

			this.setState(s => {
				s.opts.p.country = o;
				s.parents.country = s.possibleParents.countries.find(c => o.value === c.countryID);
				return s;
			});
		}
		else {
			this.setState(s => {
				wipeCountry(s);
				return s;
			});
		}
	}

	onLibrarySelect(o:Option) {
		var wipeManuscript = (s:S) => {
			// Don't destroy data passed from props
			if (this.props.primaries.manuscripts !== s.possibleParents.manuscripts) {
				Manuscript.destroyArray(s.possibleParents.manuscripts);
			}
			s.parents.manuscript = null;
			s.opts.p.manuscript = null;
			s.snProps.msSiglum = '';
		};

		var wipeLibrary = (s:S) => {
			s.parents.library = null;
			s.opts.p.library = null;
			s.snProps.libSiglum = '';
			wipeManuscript(s);
		};

		this.setState((s:S) => {
			s.opts.p.library = o;
			s.parents.library = s.possibleParents.libraries.find(l => o.value === l.libSiglum);
			return s;
		});

		if (o) {
			this.props.loadManuscripts(o.value as string, manuscripts => {
				this.setState(s => {
					wipeManuscript(s);
					s.possibleParents.manuscripts = manuscripts;
					s.opts.p.manuscripts = manuscripts.map(m => {
						return {label: m.msSiglum, value: m.msSiglum};
					});
				});
			});

			this.setState(s => {
				s.opts.p.library = o;
				s.parents.library = s.possibleParents.libraries.find(l => o.value === l.libSiglum);
				s.snProps.libSiglum = s.parents.library.libSiglum;
			});
		}
		else {
			this.setState(s => {
				wipeLibrary(s);
			});
		}
	}

	onManuscriptSelect(o:Option) {
		var wipeManuscript = (s:S) => {
			s.parents.manuscript = null;
			s.opts.p.manuscript = null;
			s.snProps.msSiglum = '';
		};

		this.setState((s:S) => {
			wipeManuscript(s);

			if (o) {
				s.opts.p.manuscript = o;
				s.snProps.manuscript = o.value as string;
			}
			return s;
		});
	}

	onSectionTypeSelect(o:Option) {
		this.setState(s => {
			s.opts.s.secType = o;
			s.snProps.sectionType = o ? o.value as string: '';
			return s;
		});
	}

	onCenturySelect(o:Option) {
		this.setState((s:S) => {
			s.opts.s.century = o;
			s.snProps.centuryID = o ? o.value as string : '';
			return s;
		});
	}

	onCursusSelect(o:Option) {
		this.setState((s:S) => {
			s.opts.s.cursus = o;
			s.snProps.cursusID = o ? o.value as string : '';
			return s;
		});
	}

	onSrcCompSelect(o:Option) {
		this.setState((s:S) => {
			s.opts.s.srcComp = o;
			s.snProps.sourceCompletenessID = o ? o.value as string : '';
			return s;
		});
	}

	onProvSelect(o:Option) {
		this.setState((s:S) => {
			s.opts.s.prov = o;
			s.snProps.provenanceID = o ? o.value as string : '';
			return s;
		});
	}

	onNotationSelect(o:Option) {
		this.setState((s:S) => {
			s.opts.s.notation = o;
			s.snProps.notationID= o ? o.value as string : '';
			return s;
		});
	}

	onTextInputChange(e:React.FormEvent<FormControl>) {
		const target = e.target as HTMLInputElement;
		const k = target.id;
		const v = target.value;
		this.setState((s:S) => {
			s.snProps[k] = v;
			return s;
		});
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		if (this.state.isNew) {
			var val: StateVal = {
				countryID: this.state.opts.p.country ? null : 'error',
				libSiglum: this.state.snProps.libSiglum ? null : 'error',
				msSiglum: this.state.snProps.msSiglum ? null : 'error',
				sectionID: this.state.snProps.sectionID ? null : 'error'
			};

			for (let k in val) {
				if (val[k] !== null) {
					return this.setState((s:S) => {
						s.val = val;
						return s;
					});
				}
			}
		}

		var snProps = this.state.snProps;
		var isNew = this.state.isNew;

		if (typeof snProps.numGatherings === 'string') {
			snProps.leaves = Number.parseInt(snProps.numGatherings);
		}
		if (typeof snProps.numColumns === 'string') {
			snProps.leaves = Number.parseInt(snProps.numColumns);
		}
		if (typeof snProps.linesPerColumn === 'string') {
			snProps.leaves = Number.parseInt(snProps.linesPerColumn);
		}

		this.props.onSubmit(snProps, isNew);
	}
}
