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

import * as mst from '@src/models/msType.ts';

interface P {
	msType: mst.MsType
	onBack: () => void
	onSubmit: (p:mst.Properties,isNew:boolean) => void
}
interface S {
	isNew: boolean
	mProps: mst.Properties
	val: {
		msType: any
		msTypeName: any
	}
}

export default class MsTypeEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		var isNew = !Boolean(p.msType);
		var mProps: mst.Properties
		if (isNew) {
			mProps = {
				msType: '',
				msTypeName: ''
			};
		}
		else {
			mProps = p.msType.toProperties();
		}

		this.state = {
			isNew: isNew,
			mProps: mProps,
			val: {
				msType: null,
				msTypeName: null
			}
		};

		this.getMsTypeFormGroup = this.getMsTypeFormGroup.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		var x: JSX.Element[] = [];
		x.push(<Header key="header" min>Manuscript Type - {this.state.isNew ? 'Create' : 'Edit'}</Header>);
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
			{this.getMsTypeFormGroup()}

			<FormGroup
				controlId="msTypeName"
				validationState={this.state.val.msTypeName}
			>
				<Col
					sm={3}
					componentClass={ControlLabel}
					className="required"
				>Name:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.mProps.msTypeName}
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

	getMsTypeFormGroup() {
		var label, value: JSX.Element;
		if (this.state.isNew) {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Manuscript Type:</Col>);

			value = (<Col sm={4}>
				<FormControl
					type="text"
					value={this.state.mProps.msType}
					onChange={this.onChange}
				/>
			</Col>);
		}
		else {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
			>Manuscript Type:</Col>);

			value = (<Col sm={4} className="pt7 pl27">
				{this.props.msType.msType}
			</Col>);
		}

		return (<FormGroup
			controlId="msType"
			validationState={this.state.val.msType}
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
			s.mProps[k] = v;
			return s;
		});
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		var val:any = {
			msTypeName: this.state.mProps.msTypeName ? null : 'error'
		};

		if (this.state.isNew) {
			val.msType = this.state.mProps.msType ? null : 'error'
		}

		for (let k in val) {
			if (val[k] !== null) {
				return this.setState((s:S) => {
					s.val = val;
					return s;
				});
			}
		}

		// Update validation state while submit is processing
		this.setState((s:S) => {
			s.val = val;
			this.props.onSubmit(s.mProps, this.state.isNew);
			return s;
		});
	}
}