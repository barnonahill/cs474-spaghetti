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

import * as cs from '@src/models/cursus.ts';

interface P {
	onBack: () => void
	onSubmit: (csProps:cs.Properties, isNew:boolean) => void
	csProps?: cs.Properties

	isNew?: boolean
	val?: null | 'error'
}
interface S {
	isNew: boolean
	csProps: cs.Properties

	// validationState
	val: any
}

export default class CursusEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var isNew: boolean;
		if (typeof p.isNew === 'boolean') {
			isNew = p.isNew;
		}
		else {
			isNew = !Boolean(p.csProps)
		}
		var csProps = p.csProps || {
			cursusID: '',
			cursusName: ''
		};

		this.state = {
			isNew: isNew,
			csProps: csProps,
			val: p.val || null
		};
		csProps.cursusName = csProps.cursusName || '';

		// render helper
		this.getCursusIDFormGroup = this.getCursusIDFormGroup.bind(this);

		// event handlers
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		var x: JSX.Element[] = [];
		x.push(<Header key="header" min>{this.state.isNew
			? 'Create a Cursus'
			: 'Edit Cursus: ' + this.state.csProps.cursusName}</Header>);

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
			{this.getCursusIDFormGroup()}

			<FormGroup
				controlId="cursusName"
			>
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Cursus Name:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.csProps.cursusName}
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

	getCursusIDFormGroup() {
		var label, value: JSX.Element;

		if (this.state.isNew) {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Cursus ID:</Col>);

			value = (<Col sm={4}>
				<FormControl
					type="text"
					value={this.state.csProps.cursusID}
					onChange={this.onChange}
				/>
			</Col>);
		}

		else {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
			>Cursus ID:</Col>);

			value = (<Col sm={4} className="pt7 pl27">
				{this.state.csProps.cursusID}
			</Col>);
		}

		return (<FormGroup
			controlId="cursusID"
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
			s.csProps[k] = v;
			return s;
		});
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();

		var val = this.state.csProps.cursusID ? null : 'error';

		this.setState((s:S) => {
			s.val = val as S['val'];
			return s;
		});

		if (val === null) {
			this.props.onSubmit(this.state.csProps, this.state.isNew);
		}
	}
}
