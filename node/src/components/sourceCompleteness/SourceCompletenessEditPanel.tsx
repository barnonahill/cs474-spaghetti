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
	sourceCompleteness: sc.SourceCompleteness
	onBack: () => void
	onSubmit: (scProps:sc.Properties, isNew:boolean) => void
}
interface S {
	isNew: boolean
	scProps: sc.Properties

	// validationState
	val: any
}

export default class SourceCompletenessEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var isNew = !Boolean(p.sourceCompleteness);
		var scProps: sc.Properties;

		if (isNew) {
			scProps = {
				sourceCompletenessID: '',
				sourceCompletenessName: ''
			}
		}

		else {
			scProps = p.sourceCompleteness.toProperties();
			scProps.sourceCompletenessName = scProps.sourceCompletenessName || '';
		}

		this.state = {
			isNew: isNew,
			scProps: scProps,
			val: null
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
			: 'Edit Source Completeness: ' + this.props.sourceCompleteness.sourceCompletenessName}</Header>);

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
				>SourceCompleteness Name:</Col>
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
			>SourceCompleteness ID:</Col>);

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
			>SourceCompleteness ID:</Col>);

			value = (<Col sm={4} className="pt7 pl27">
				{this.props.sourceCompleteness.sourceCompletenessID}
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
		var val = this.state.scProps.sourceCompletenessID ? null : 'error'

		this.setState((s:S) => {
			s.val = val;
			return s;
		});

		if (val === null) {
			this.props.onSubmit(this.state.scProps, this.state.isNew);
		}
	}
}
