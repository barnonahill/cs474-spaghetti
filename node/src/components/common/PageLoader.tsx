import * as React from 'react';

interface P {
	inner: string
}
interface S {}

// Requires CSS
export default class FullPageLoader extends React.Component<P,S> {
	constructor(p:P) {
		super(p);
	}

	render() {
		return (
			<div className="full-page-loader">
				<div className="loader"></div>
				<h3 className="text-center">{this.props.inner}</h3>
			</div>
		);
	}
}
