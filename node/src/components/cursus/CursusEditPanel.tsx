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

import * as cs from '@src/models/cursus.ts';

interface Val {
	cursusID: ValState,
	cursusName: ValState
	[x: string]: ValState
}

interface P {
	onBack: () => void
	onSubmit: (editState:S) => void
	editState?: Partial<S>
}
export interface S {
	isNew: boolean
	csProps: cs.Properties
	val: Val
}

export default class CursusEditPanel extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
		const es = p.editState || {};

		this.state = {
			isNew: typeof es.isNew === 'boolean' ? es.isNew : !Boolean(es.csProps),
			csProps: es.csProps || cs.Cursus.createProperties(),
			val: es.val || {
				cursusID: null,
				cursusName: null
			}
		};

		this.renderCursusIDFormGroup = this.renderCursusIDFormGroup.bind(this);
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
			{this.renderCursusIDFormGroup()}

			<FormGroup
				controlId="cursusName"
				validationState={this.state.val.cursusName}>
				<Col
					sm={3}
					componentClass={ControlLabel}
				>Cursus Name:</Col>
				<Col sm={4}>
					<FormControl
						type="text"
						value={this.state.csProps.cursusName}
						onChange={e => {
							var cursusName = (e.target as HTMLInputElement).value;
							this.setState((s:S) => {
								s.csProps.cursusName = cursusName;
								s.val.cursusName = (cursusName && cursusName.length > cs.Cursus.MAX_LENGTHS.cursusName
									? 'error' : null);
								return s;
							});
						}}
					/>
				</Col>
				<HelpBlock>
					{this.state.csProps.cursusName.length + ' / ' + cs.Cursus.MAX_LENGTHS.cursusName}
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

	renderCursusIDFormGroup() {
		var label, value: JSX.Element | JSX.Element[];

		if (this.state.isNew) {
			label = (<Col
				sm={3}
				componentClass={ControlLabel}
				className="required"
			>Cursus ID:</Col>);

			value = [(<Col sm={4} key="v">
				<FormControl
					type="text"
					value={this.state.csProps.cursusID}
					onChange={e => {
						var cursusID = (e.target as HTMLInputElement).value;
						this.setState((s:S) => {
							s.csProps.cursusID = cursusID;
							s.val.cursusID = (cursusID && cursusID.length <= cs.Cursus.MAX_LENGTHS.cursusID
								? null : 'error');
							return s;
						});
					}}
				/>
			</Col>),
			<HelpBlock key="h">
				{this.state.csProps.cursusID.length + ' / ' + cs.Cursus.MAX_LENGTHS.cursusID}
			</HelpBlock>];
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
			validationState={this.state.val.cursusID}
		>
			{label}
			{value}
		</FormGroup>);
	}

	onSubmit(e:React.FormEvent<Form>) {
		e.preventDefault();
		var val = this.state.val;
		if (!this.state.csProps.cursusID) {
			val.cursusID = 'error';
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
