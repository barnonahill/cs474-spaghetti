import * as React from 'react';

interface HeaderProps {
	tag?: string; // Optional param
	min?: boolean
}

export default class Header extends React.Component<HeaderProps, {}> {
	private tag: string;

	constructor(props: HeaderProps) {
		super(props);
		this.tag = props.tag ? `${props.tag}` : `h2`;
	}

	render() {
		var className = this.props.min ? 'min-page-header' : 'page-header';
		return (
			<div className={className}>
				<this.tag>{this.props.children}</this.tag>
			</div>
		);
	}
}
