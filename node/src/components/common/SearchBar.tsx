import * as React from 'react';

import {
	Button,
	FormControl,
	Glyphicon,
	InputGroup
} from 'react-bootstrap';

interface P {
	placeholder: string
	onSubmit: (v:string) => void
}
interface S {
	value: string
	isFiltered: boolean
}

export default class SearchBar extends React.Component<P,S> {
	constructor(p:P) {
		super(p);

		this.state = {value:'', isFiltered:false};
		this.clear = this.clear.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}

	onChange(e:React.FormEvent<FormControl>) {
		const target = e.target as HTMLInputElement;
		const v = target.value;
		this.setState((s:S) => {
			s.value = v;
			return s;
		});
	}

	onKeyPress(e:React.KeyboardEvent<FormControl>) {
		if (e.key === 'Enter') {
			this.setState((s:S) => {
				s.isFiltered = this.state.value ? true : false;
				this.props.onSubmit(this.state.value.toLowerCase());
				return s;
			});
		}
	}

	clear() {
		this.setState((s:S) => {
			s.value = '';
			s.isFiltered = false;
			this.props.onSubmit('');
			return s;
		});
	}

	render() {
		return (<InputGroup>
			<FormControl
				type="search"
				value={this.state.value}
				onChange={this.onChange}
				onKeyPress={this.onKeyPress}
				placeholder={this.props.placeholder}
			/>
			{this.state.isFiltered && <span
				className="input-delete"
				onClick={() => this.clear()}
			><Glyphicon glyph="remove" /></span>}
			<Button
				componentClass={InputGroup.Addon}
				onClick={() => this.props.onSubmit(this.state.value.toLowerCase())}
			><Glyphicon glyph="search" /></Button>
		</InputGroup>);
	}
}
