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

import * as ct from '@src/models/century.ts';

interface P {
	onBack: () => void
	onSubmit: (ctProps:ct.Properties, isNew:boolean) => void

	isNew?: boolean
	ctProps?: ct.Properties
	val?: null | 'error'
}
interface S {
	isNew: boolean
	ctProps: ct.Properties

	// validationState
	val: null | 'error'
}

export default class CenturyEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var isNew: boolean;
		if (typeof p.isNew === 'boolean') {
			isNew = p.isNew;
		}
		else {
			isNew = !Boolean(p.ctProps)
		}

		var ctProps = p.ctProps || {
			centuryID: '',
			centuryName: ''
		};
		ctProps.centuryName = ctProps.centuryName || '';

		this.state = {
			isNew: isNew,
			ctProps: ctProps,
			val: p.val || null
		};

		// render helper
		this.getCenturyIDFormGroup = this.getCenturyIDFormGroup.bind(this);

		// event handlers
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		var x: JSX.Element[] = [];
		x.push(<Header key="header" min>{this.state.isNew
			? 'Create a Century'
			: 'Edit Century: ' + this.props.ctProps.centuryName}</Header>);

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
			{this.getCenturyIDFormGroup()}

			<FormGroup
				controlId="centuryName"
			>
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Century Name:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.ctProps.centuryName}
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

	getCenturyIDFormGroup() {
		var label, value: JSX.Element;

		if (this.state.isNew) {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Century ID:</Col>);

			value = (<Col sm={4}>
				<FormControl
					type="text"
					value={this.state.ctProps.centuryID}
					onChange={this.onChange}
				/>
			</Col>);
		}

		else {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
			>Century ID:</Col>);

			value = (<Col sm={4} className="pt7 pl27">
				{this.props.ctProps.centuryID}
			</Col>);
		}

		return (<FormGroup
			controlId="centuryID"
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
			s.ctProps[k] = v;
			return s;
		});
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		var val = this.state.ctProps.centuryID ? null : 'error'

		this.setState((s:S) => {
			s.val = val as S['val'];
			return s;
		});

		if (val === null) {
			this.props.onSubmit(this.state.ctProps, this.state.isNew);
		}
	}
}
