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

import * as nt from '@src/models/notation.ts';

interface P {
	notation: nt.Notation
	onBack: () => void
	onSubmit: (ntProps:nt.Properties, isNew:boolean) => void
}
interface S {
	isNew: boolean
	ntProps: nt.Properties

	// validationState
	val: any
}

export default class NotationEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var isNew = !Boolean(p.notation);
		var ntProps: nt.Properties;

		if (isNew) {
			ntProps = {
				notationID: '',
				notationName: ''
			}
		}

		else {
			ntProps = p.notation.toProperties();
			ntProps.notationName = ntProps.notationName || '';
		}

		this.state = {
			isNew: isNew,
			ntProps: ntProps,
			val: null
		};

		// render helper
		this.getNotationIDFormGroup = this.getNotationIDFormGroup.bind(this);

		// event handlers
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		var x: JSX.Element[] = [];
		x.push(<Header key="header" min>{this.state.isNew
			? 'Create a Notation'
			: 'Edit Notation: ' + this.props.notation.notationName}</Header>);

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
			{this.getNotationIDFormGroup()}

			<FormGroup
				controlId="notationName"
			>
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Notation Name:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.ntProps.notationName}
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

	getNotationIDFormGroup() {
		var label, value: JSX.Element;

		if (this.state.isNew) {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Notation ID:</Col>);

			value = (<Col sm={4}>
				<FormControl
					type="text"
					value={this.state.ntProps.notationID}
					onChange={this.onChange}
				/>
			</Col>);
		}

		else {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
			>Notation ID:</Col>);

			value = (<Col sm={4} className="pt7 pl27">
				{this.props.notation.notationID}
			</Col>);
		}

		return (<FormGroup
			controlId="notationID"
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
			s.ntProps[k] = v;
			return s;
		});
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();

		var val = this.state.ntProps.notationID ? null : 'error';

		this.setState((s:S) => {
			s.val = val as S['val'];
			return s;
		});

		if (val === null) {
			this.props.onSubmit(this.state.ntProps, this.state.isNew);
		}
	}
}
