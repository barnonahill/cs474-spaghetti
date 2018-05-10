import * as React from 'react';
import {
	Button,
	Col,
	ControlLabel,
	InputGroup,
	Form,
	FormControl,
	FormGroup,
	HelpBlock
} from 'react-bootstrap';

import Header from '@src/components/common/Header.tsx';
import PanelMenu from '@src/components/common/PanelMenu.tsx';
import ValState from '@src/components/common/FormValidation.ts';

import * as mst from '@src/models/msType.ts';

export interface Val {
	msType: ValState
	msTypeName: ValState
	[x: string]: ValState
}

interface P {
	onBack: () => void
	onSubmit: (editState: S) => void
	editState: Partial<S>
}

export interface S {
	isNew: boolean
	mProps: mst.Properties
	val: Val
}

export default class MsTypeEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
		const es = p.editState || {};

		this.state = {
			isNew: typeof es.isNew === 'boolean' ? es.isNew : !Boolean(es.mProps),
			mProps: es.mProps || mst.MsType.createProperties(),
			val: es.val || {
				msType: null,
				msTypeName: null
			}
		};

		this.renderMsTypeFormGroup = this.renderMsTypeFormGroup.bind(this);
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
			{this.renderMsTypeFormGroup()}

			<FormGroup
				controlId="msTypeName"
				validationState={this.state.val.msTypeName}
			>
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Name:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.mProps.msTypeName}
						onChange={e => {
							var msTypeName = (e.target as HTMLInputElement).value;
							this.setState((s:S) => {
								s.mProps.msTypeName = msTypeName;
								s.val.msTypeName = (msTypeName && msTypeName.length <= mst.MsType.MAX_LENGTHS.msTypeName ?
									null : 'error');
								return s;
							});
					}}
					/>
				</Col>
				<HelpBlock>
					{this.state.mProps.msTypeName.length + ' / ' + mst.MsType.MAX_LENGTHS.msTypeName}
				</HelpBlock>
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

	renderMsTypeFormGroup() {
		var label, value: JSX.Element | JSX.Element[];
		if (this.state.isNew) {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Manuscript Type:</Col>);

			value = [<Col sm={4} key="v">
				<FormControl
					type="text"
					value={this.state.mProps.msType}
					onChange={e => {
						var msType:string = (e.target as HTMLInputElement).value;
						this.setState((s:S) => {
							s.mProps.msType = msType;
							s.val.msType = (msType && msType.length <= mst.MsType.MAX_LENGTHS.msType ) ? null : 'error';
							return s;
						});
					}}
				/>
			</Col>,
			<HelpBlock key="h">
				{this.state.mProps.msType.length + ' / ' + mst.MsType.MAX_LENGTHS.msType}
			</HelpBlock>];
		}
		else {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
			>Manuscript Type:</Col>);

			value = (<Col sm={4} className="pt7 pl27">
				{this.state.mProps.msType}
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

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		var val = this.state.val;
		if (!this.state.mProps.msType) {
			val.msType = 'error';
		}

		this.setState((s:S) => {
			s.val = val;
			return s;
		});

		for (let k in val) {
			if (val[k] === 'error') {
				return;
			}
		}

		this.setState((s:S) => {
			this.props.onSubmit(s);
		});
	}
}
