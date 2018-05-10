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
import * as ct from '@src/models/century.ts';

export interface Val {
	centuryID: ValState
	centuryName: ValState
	[x: string]: ValState
}

interface P {
	onBack: () => void
	onSubmit: (editState:S) => void
	editState: Partial<S>
}
export interface S {
	isNew: boolean
	ctProps: ct.Properties
	val: Val
}

export default class CenturyEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
		const es = p.editState || {};

		this.state = {
			isNew: typeof es.isNew === 'boolean' ? es.isNew : !Boolean(es.ctProps),
			ctProps: es.ctProps || ct.Century.createProperties(),
			val: es.val || {
				centuryID: null,
				centuryName: null
			}
		};

		this.renderCenturyIDFormGroup = this.renderCenturyIDFormGroup.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		var x: JSX.Element[] = [];
		x.push(<Header key="header" min>{this.state.isNew
			? 'Create a Century'
			: 'Edit Century: ' + this.state.ctProps.centuryID}</Header>);

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
			{this.renderCenturyIDFormGroup()}

			<FormGroup
				controlId="centuryName"
				validationState={this.state.val.centuryName}>
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Century Name:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.ctProps.centuryName}
						onChange={e => {
							var centuryName = (e.target as HTMLInputElement).value;
							this.setState((s:S) => {
								s.ctProps.centuryName = centuryName;
								s.val.centuryName = (centuryName && centuryName.length > ct.Century.MAX_LENGTHS.centuryName
									? 'error' : null);
								return s;
							});
						}}
					/>
				</Col>
				<HelpBlock>
					{this.state.ctProps.centuryName.length + ' / ' + ct.Century.MAX_LENGTHS.centuryName}
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

	renderCenturyIDFormGroup() {
		var label, value: JSX.Element | JSX.Element[];

		if (this.state.isNew) {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Century ID:</Col>);

			value = [<Col sm={4} key="v">
				<FormControl
					type="text"
					value={this.state.ctProps.centuryID}
					onChange={e => {
						var centuryID = (e.target as HTMLInputElement).value;
						this.setState((s:S) => {
							s.ctProps.centuryID = centuryID;
							s.val.centuryID = (centuryID && centuryID.length <= ct.Century.MAX_LENGTHS.centuryID
								? null : 'error');
							return s;
						});
					}}
				/>
			</Col>,
			<HelpBlock key="h">
				{this.state.ctProps.centuryID.length + ' / ' + ct.Century.MAX_LENGTHS.centuryID}
			</HelpBlock>];
		}

		else {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
			>Century ID:</Col>);

			value = (<Col sm={4} className="pt7 pl27">
				{this.state.ctProps.centuryID}
			</Col>);
		}

		return (<FormGroup
			controlId="centuryID"
			validationState={this.state.val.centuryID}>
			{label}
			{value}
		</FormGroup>);
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		var val = this.state.val;
		if (!this.state.ctProps.centuryID) {
			val.centuryID = 'error';
		}

		this.setState((s:S) => {
			s.val = val;
			return s;
		});

		for (let k in val) {
			if (val[k] === 'error') return;
		}

		this.setState((s:S) => {
			this.props.onSubmit(s);
		});
	}
}
