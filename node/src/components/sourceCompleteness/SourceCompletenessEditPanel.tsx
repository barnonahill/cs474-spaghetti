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

import * as sc from '@src/models/sourceCompleteness.ts';

interface P {
	onBack: () => void
	onSubmit: (scProps:sc.Properties, isNew:boolean) => void
	scProps?: sc.Properties
	isNew?: boolean
	val?: null | 'error'
}
interface S {
	isNew: boolean
	scProps: sc.Properties

	// validationState
	val: null | 'error'
}

export default class SourceCompletenessEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var isNew: boolean;
		if (typeof p.isNew === 'boolean')  {
			isNew = p.isNew;
		}
		else {
			isNew = !Boolean(p.scProps);
		}

		var scProps = p.scProps || {
			sourceCompletenessID: '',
			sourceCompletenessName: ''
		}
		scProps.sourceCompletenessName = scProps.sourceCompletenessName || '';

		this.state = {
			isNew: isNew,
			scProps: scProps,
			val: p.val || null
		};

		// render helper
		this.getSourceCompletenessIDFormGroup = this.getSourceCompletenessIDFormGroup.bind(this);

		// event handlers
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		var x: JSX.Element[] = [];
		x.push(<Header key="header" min>{this.state.isNew
			? 'Create a Source Completeness'
			: 'Edit Source Completeness: ' + this.state.scProps.sourceCompletenesID}</Header>);

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
			{this.getSourceCompletenessIDFormGroup()}

			<FormGroup
				controlId="sourceCompletenessName"
			>
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Source Completeness Name:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.scProps.sourceCompletenessName}
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

	getSourceCompletenessIDFormGroup() {
		var label, value: JSX.Element;

		if (this.state.isNew) {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Source Completeness ID:</Col>);

			value = (<Col sm={4}>
				<FormControl
					type="text"
					value={this.state.scProps.sourceCompletenessID}
					onChange={this.onChange}
				/>
			</Col>);
		}

		else {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
			>Source Completeness ID:</Col>);

			value = (<Col sm={4} className="pt7 pl27">
				{this.state.scProps.sourceCompletenessID}
			</Col>);
		}

		return (<FormGroup
			controlId="sourceCompletenessID"
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
			s.scProps[k] = v;
			return s;
		});
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		var val: S['val'] = this.state.scProps.sourceCompletenessID ? null : 'error'

		this.setState((s:S) => {
			s.val = val;
			return s;
		});

		if (val === null) {
			this.props.onSubmit(this.state.scProps, this.state.isNew);
		}
	}
}
