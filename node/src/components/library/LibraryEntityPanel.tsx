import * as React from 'react';
import {
	Col,
	Form,
	FormGroup,
	ControlLabel,
	Button
} from 'react-bootstrap';

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';

import ManuscriptApp, {
	Panel as MsPanelEnum
} from '@src/components/manuscript/ManuscriptApp.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';
import { Manuscript } from '@src/models/manuscript.ts';
import { MsType } from '@src/models/msType.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum Panel {
	ENT=0,
	MS=1
}

interface P {
	countries: Country[]
	country: Country;
	library: Library;
	onBack: () => void
}
interface S {
	panel: Panel
	address: string
	google: string
	manuscripts?: Manuscript[]
	msTypes?: MsType[]
}

export default class LibraryEntityPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
		this.state = {
			panel: Panel.ENT,
			address: this.formatAddress(),
			google: this.getGoogleMapsUrl()
		};

		this.getEntityPanel = this.getEntityPanel.bind(this);
		this.getManuscriptApp = this.getManuscriptApp.bind(this);
	}

	getGoogleMapsUrl() {
		const c = this.props.country;
		const l = this.props.library;
		// https://www.google.com/maps/search/Newberry+Library,+Chicago,+United+States/
		const getUpdatedUrl = (a:string, r:string, last:boolean) => {
			a += r.replace(' ','+');
			if (!last) {
				a += '+';
			}
			return a;
		};
		var u = getUpdatedUrl('https://www.google.com/maps/search/',l.library,false);

		if (l.address1) {
			u = getUpdatedUrl(u,l.address1,false);
		}
		if (l.address2) {
			u = getUpdatedUrl(u,l.address2,false);
		}
		u = getUpdatedUrl(u,l.city,false);
		if (l.postCode) {
			u = getUpdatedUrl(u,l.postCode,false);
		}
		u = getUpdatedUrl(u,c.country,true);

		return u;
	}

	formatAddress(): string {
		const c = this.props.country;
		const l = this.props.library;
		var a = 'NULL';
		if (l.address1) {
			a = l.address1;

			if (l.address2) {
				a += "\n" + l.address2;
			}
			a += "\n" + l.city;

			if (l.postCode) {
				a += ', ' + l.postCode;
			}
			a += "\n" + c.country;
		}

		return a;
	}

	renderMultiLine(s:String): Array<JSX.Element> {
		return s.split("\n").map((l:String, i:number) => {
			return <span key={i}>{l}<br/></span>;
		});
	}

	render() {
		switch (this.state.panel) {
			case Panel.ENT:
			default:
				return this.getEntityPanel();

			case Panel.MS:
				return this.getManuscriptApp();
		}
	}

	getEntityPanel() {
		var x: JSX.Element[] = [];
		x.push(<Header key="header" min>{this.props.library.library}</Header>);
		x.push(<PanelMenu key="panelMenu">
			<Button bsStyle="default" onClick={this.props.onBack}>Back</Button>

			<a href={this.state.google} target="_blank" className="ml15">
				<Button bsStyle="info">Google Maps</Button>
			</a>

			<Button
				bsStyle="info"
				className="fr"
				onClick={() => this.setState((s:S) => {
					s.panel = Panel.MS;
					return s;
				})}
			>Manuscripts</Button>
		</PanelMenu>);

		x.push(<Form horizontal key="form">
			<FormGroup>
				<Col sm={3} componentClass={ControlLabel}>Library Siglum:</Col>
				<Col sm={4} className="pt7">{this.props.library.libSiglum}</Col>
			</FormGroup>

			<FormGroup>
				<Col sm={3} componentClass={ControlLabel}>Library Name:</Col>
				<Col sm={4} className="pt7">{this.props.library.library}</Col>
			</FormGroup>

			<FormGroup>
				<Col sm={3} componentClass={ControlLabel}>City:</Col>
				<Col sm={4} className="pt7">{this.props.library.city}</Col>
			</FormGroup>

			<FormGroup>
				<Col sm={3} componentClass={ControlLabel}>Country:</Col>
				<Col sm={4} className="pt7">{this.props.country.country}</Col>
			</FormGroup>

			<FormGroup>
				<Col sm={3} componentClass={ControlLabel}>Address:</Col>
				<Col sm={4} className="pt7">{this.renderMultiLine(this.state.address)}</Col>
			</FormGroup>
		</Form>);

		return x;
	}

	getManuscriptApp() {
		return (<ManuscriptApp
			panel={MsPanelEnum.TABLE}
			countries={this.props.countries}
			country={this.props.country}
			library={this.props.library}

			onBack={() => this.setState((s:S) => {
				s.panel = Panel.ENT;
				return s;
			})}
		/>);
	}

	loadManuscripts(callback?: (s:S) => S) {
		proxyFactory.getManuscriptProxy()
			.getManuscripts(this.props.country.countryID, this.props.library.libSiglum, (m, e?) =>
		{
			if (e) {
				alert(e);
			}
			else {
				this.setState((s:S) => {
					Manuscript.destroyArray(s.manuscripts);
					s.manuscripts = m;

					if (callback) return callback(s);
					return s;
				});
			}
		});
	}
}
