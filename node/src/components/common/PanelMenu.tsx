import * as React from 'react';

export default class PanelMenu extends React.Component<{},{}> {
	constructor(p:any) {
		super(p);
	}

	render() {
		return (
			<div className="panel-menu">
				{this.props.children}
			</div>
		);
	}
}
