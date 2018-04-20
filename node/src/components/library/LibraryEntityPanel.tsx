import * as React from 'react';
import {
	Col,
	Form,
	FormGroup,
	ControlLabel,
	Button
} from 'react-bootstrap';

import PanelMenu from '@src/components/common/PanelMenu.tsx';

import { Country } from '@src/models/country.ts';
import { Library } from '@src/models/library.ts';

interface P {
	country: Country;
	library: Library;
	onBack: () => void
}
interface S {
	address: string
	google: string
}


export default class LibraryEntityPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
		this.state = {
			address: this.formatAddress(),
			google: this.getGoogleMapsUrl()
		};
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
				a += l.address2;
			}
			a += l.city;

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
		const c = this.props.country;
		const l = this.props.library;
		return [
			(<PanelMenu key="panelMenu">
				<Button bsStyle="default" onClick={this.props.onBack}>Back</Button>

				<a href={this.state.google} target="_blank" className="ml15">
					<Button bsStyle="info">Google Maps</Button>
				</a>
			</PanelMenu>),

			(<Form horizontal key="form">
			<FormGroup>
				<Col sm={3} componentClass={ControlLabel}>Library Siglum:</Col>
				<Col sm={4} className="pt7">{l.libSiglum}</Col>
			</FormGroup>

			<FormGroup>
				<Col sm={3} componentClass={ControlLabel}>Library Name:</Col>
				<Col sm={4} className="pt7">{l.library}</Col>
			</FormGroup>

			<FormGroup>
				<Col sm={3} componentClass={ControlLabel}>City:</Col>
				<Col sm={4} className="pt7">{l.city}</Col>
			</FormGroup>

			<FormGroup>
				<Col sm={3} componentClass={ControlLabel}>Country:</Col>
				<Col sm={4} className="pt7">{c.country}</Col>
			</FormGroup>

			<FormGroup>
				<Col sm={3} componentClass={ControlLabel}>Address:</Col>
				<Col sm={4} className="pt7">{this.renderMultiLine(this.state.address)}</Col>
			</FormGroup>
		</Form>)
	];
	}
}
