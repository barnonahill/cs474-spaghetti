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

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';

import * as pv from '@src/models/provenance.ts';

interface P {
	provenance: pv.Provenance
	onBack: () => void
	onSubmit: (pvProps:pv.Properties, isNew:boolean) => void
}
interface S {
	isNew: boolean
	pvProps: pv.Properties

	// validationState
	val: any
}

export default class ProvenanceEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var isNew = !Boolean(p.provenance);
		var pvProps: pv.Properties;

		if (isNew) {
			pvProps = {
				provenanceID: '',
				provenanceName: ''
			}
		}

		else {
			pvProps = p.provenance.toProperties();
			pvProps.provenanceName = pvProps.provenanceName || '';
		}

		this.state = {
			isNew: isNew,
			pvProps: pvProps,
			val: null
		};

		// render helper
		this.getProvenanceIDFormGroup = this.getProvenanceIDFormGroup.bind(this);

		// event handlers
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		var x: JSX.Element[] = [];
		x.push(<Header key="header" min>{this.state.isNew
			? 'Create a Provenance'
			: 'Edit Provenance: ' + this.props.provenance.provenanceName}</Header>);

		x.push(<PanelMenu key="panelMenu">
			<Button
				bsStyle="default"
				onClick={this.props.onBack}
			>Back</Button>
		</PanelMenu>);

		x.push(<Form key="form"
			horizontal
			onSubmit={this.onSubmit}
		>
			{this.getProvenanceIDFormGroup()}

			<FormGroup
				controlId="provenanceName"
			>
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Provenance Name:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.pvProps.provenanceName}
						onChange={this.onChange}
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

	getProvenanceIDFormGroup() {
		var label, value: JSX.Element;

		if (this.state.isNew) {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Provenance ID:</Col>);

			value = (<Col sm={4}>
				<FormControl
					type="text"
					value={this.state.pvProps.provenanceID}
					onChange={this.onChange}
				/>
			</Col>);
		}

		else {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
			>Provenance ID:</Col>);

			value = (<Col sm={4} className="pt7 pl27">
				{this.props.provenance.provenanceID}
			</Col>);
		}

		return (<FormGroup
			controlId="provenanceID"
			validationState={this.state.val}
		>
			{label}
			{value}
		</FormGroup>);
	}

	onChange(e:React.FormEvent<FormControl>) {
		const target = e.target as HTMLInputElement;
		const k = target.id;
		const v = target.value;

		this.setState((s:S) => {
			s.pvProps[k] = v;
			return s;
		});
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();

		var val = this.state.pvProps.provenanceID ? null : 'error';

		this.setState((s:S) => {
			s.val = val as S['val'];
			return s;
		});

		if (val === null) {
			this.props.onSubmit(this.state.pvProps, this.state.isNew);
		}
	}
}
