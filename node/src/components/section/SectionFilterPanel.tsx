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
import { Manuscript } from '@src/models/manuscript.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

interface P {
	countries: Array<Country>
	onBack: () => void
	onSubmit: (c:Country, l:Library, m:Manuscript,  ls:Library[], ms:Manuscript[]) => void
}
interface S {
	ents: {
		libraries?: Library[]
		manuscripts?: Manuscript[]
	}
	opts: {
		country?: Option
		countries: Options
		library?: Option
		libraries?: Options
		manuscript?: Option
		manuscripts?: Options
	}
	val: {
		countryID: any
		libSiglum: any,
		msSiglum: any
	}
}

export default class SectionFilterPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {
			ents: {},
			opts: {
				countries: p.countries.map((c) => {
					return {label: c.country, value: c.countryID};
				})
			},
			val: {
				countryID: null,
				libSiglum: null,
				msSiglum: null
			}
		};

		this.onCountrySelect = this.onCountrySelect.bind(this);
		this.onLibrarySelect = this.onLibrarySelect.bind(this);
		this.onManuscriptSelect = this.onManuscriptSelect.bind(this);

		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		var xs: JSX.Element[] = [];
		xs.push(<Header key="header" min>Filter Sections</Header>);

		xs.push(<PanelMenu key="panelMenu">
			<Button
				bsStyle="default"
				onClick={this.props.onBack}
			>Back</Button>
		</PanelMenu>);

		xs.push(<Alert
			bsStyle="info"
			className="mb20 mr15p ml15p text-center"
			key="alert"
		><strong>
			Filter sections by country, library, and manuscript.
		</strong></Alert>);

		xs.push(<Form
			horizontal
			key="form"
			onSubmit={this.onSubmit}
		>
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
						value={this.state.opts.country}
						options={this.state.opts.countries}
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
						value={this.state.opts.library}
						options={this.state.opts.libraries}
						onChange={this.onLibrarySelect}
						className={this.state.val.libSiglum == null ? '' : 'has-error'}
					/>
				</Col>
			</FormGroup>

			<FormGroup
				controlId="msSiglum"
				validationState={this.state.val.msSiglum}
			>
				<Col sm={3}
					componentClass={ControlLabel}
					className="required"
				>Manuscript:</Col>
				<Col sm={4}>
					<Select
						name="msSiglum"
						value={this.state.opts.manuscript}
						options={this.state.opts.manuscripts}
						onChange={this.onManuscriptSelect}
						className={this.state.val.msSiglum == null ? '' : 'has-error'}
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
		</Form>);

		return xs;
	}

	onCountrySelect(o:Option) {
		if (o) {
			proxyFactory.getLibraryProxy().getLibraries(o.value as string, (ls, e?) => {
				if (e) {
					return alert(e);
				}

				this.setState((s:S) => {
					Library.destroyArray(s.ents.libraries);
					Manuscript.destroyArray(s.ents.manuscripts);
					s.opts.library = null;
					s.opts.manuscripts = null;

					s.opts.country = o;
					s.ents.libraries = ls;
					s.opts.libraries = ls.map(l => {
						return {label: l.library, value: l.libSiglum};
					});

					return s;
				});
			});
		}
		else {
			this.setState((s:S) => {
				Library.destroyArray(s.ents.libraries);
				Manuscript.destroyArray(s.ents.manuscripts);
				s.opts.libraries = null;
				s.opts.manuscripts = null;
				s.opts.library = null;
				s.opts.manuscript = null;
				s.opts.country = null;

				return s;
			});
		}
	}

	onLibrarySelect(o:Option) {
		if (o) {
			proxyFactory.getManuscriptProxy().getManuscripts(null, o.value as string, (ms, e?) => {
				if (e) {
					return alert(e);
				}

				this.setState((s:S) => {
					Manuscript.destroyArray(s.ents.manuscripts);
					s.opts.manuscript = null;

					s.opts.library = o;
					s.ents.manuscripts = ms;
					s.opts.manuscripts = ms.map(m => {
						return {label: m.msSiglum, value: m.msSiglum};
					});

					return s;
				});
			});
		}
		else {
			this.setState((s:S) => {
				Manuscript.destroyArray(s.ents.manuscripts);
				s.opts.manuscripts = null;
				s.opts.manuscript = null;
				s.opts.library = null;

				return s;
			});
		}
	}

	onManuscriptSelect(o:Option) {
		this.setState((s:S) => {
			s.opts.manuscript = o;
			return s;
		});
	}

	onSubmit(e: React.FormEvent<Form>) {
		e.preventDefault();


		var val:any = {
			countryID: this.state.opts.country ? null : 'error',
			libSiglum: this.state.opts.library ? null : 'error',
			msSiglum: this.state.opts.manuscript ? null : 'error'
		};

		for (let k in val) {
			if (val[k] !== null) {
				return this.setState((s:S) => {
					s.val = val;
					return s;
				})
			}
		}

		var country = this.props.countries
			.find(c => this.state.opts.country.value === c.countryID);

		var library = this.state.ents.libraries
			.find(l => this.state.opts.library.value === l.libSiglum);

		var manuscript = this.state.ents.manuscripts
			.find(m => this.state.opts.manuscript.value === m.msSiglum);

		this.setState((s:S) => {
			s.val = val;

			this.props.onSubmit(country, library, manuscript, this.state.ents.libraries,
				this.state.ents.manuscripts);
			return s;
		});
	}
}
