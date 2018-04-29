import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/century/CenturyTablePanel.tsx';
import EditPanel from '@src/components/century/CenturyEditPanel.tsx';

import StateUtils from '@src/components/StateUtilities.ts'

import * as ct from '@src/models/century.ts';
import proxyFactory from '@src/proxies/ProxyFactory.ts';

enum Panel {
	TABLE=0,
	EDIT=1,
	LOADER=2
}

interface P {
	centuries: ct.Century[]
	onBack: () => void
	reloadCenturies: () => void
}
interface S {
	century?: ct.Century
	centuries: ct.Century[]
	panel: Panel
	loadMessage?: string

	editOpts: {
		isNew?: boolean
		ctProps?: ct.Properties
		val?: null | 'error'
	}
}

export default class CenturyApp extends React.Component<P,S> {
	public readonly state: S
	public readonly props: P

	private setPanel: (panel: Panel, callback?: (s:S) => S, state?:S) => void
	private setLoader: (loadMessage: string, callback?: (s:S) => S, state?:S) => void

	constructor(p:P) {
		super(p);

		this.state = {
			panel: Panel.TABLE,
			centuries: this.props.centuries,
			editOpts: {}
		};

		// JSX Render Helper
		this.renderEditPanel = this.renderEditPanel.bind(this);

		// Opener
		this.openEdit = this.openEdit.bind(this);

		// Data manipulation operations
		this.saveCentury = this.saveCentury.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);

		// State helpers
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return (<TablePanel
					centuries={this.props.centuries}
					onBack={this.props.onBack}
					onEdit={this.openEdit}
					onDelete={this.confirmDelete}
					onRefresh={() => {
						this.setLoader('Loading Centuries...');
						this.props.reloadCenturies();
					}}
				/>);

			case Panel.EDIT:
				return this.renderEditPanel();

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;

			default:
				return null;
		}
	}

	renderEditPanel() {
		var edo = this.state.editOpts;
		var ctProps: ct.Properties;

		if (edo.ctProps) {
			ctProps = edo.ctProps;
		}
		else if (this.state.century) {
			ctProps = this.state.century.toProperties();
		}
		else {
			ctProps = null;
		}

		return (<EditPanel
			onBack={() => this.setPanel(Panel.TABLE, s => {
				s.editOpts = {};
				return s;
			})}
			onSubmit={this.saveCentury}
			ctProps={ctProps}
			isNew={edo.isNew}
			val={edo.val}
		/>);
	}

	/**
	 * Attempts to delete century using the sectionProxy.
	 * @param century to delete
	 */
	confirmDelete(century: ct.Century) {
		var del = confirm('Delete century ' + century.centuryID + '?');
		if (del) {
			this.setLoader('Deleting ' + century.centuryID + '...');

			proxyFactory.getSectionProxy().deleteCentury(century.centuryID, (success, e?) => {
				if (e) {
					alert('Error deleting Century: ' + e);
					this.setPanel(Panel.TABLE);
				}
				else if (success) {
					this.setPanel(Panel.TABLE, s => {
						var i = s.centuries.findIndex(c => century.centuryID === c.centuryID);
						s.centuries[i].destroy();
						s.centuries.splice(i, 1);

						return s;
					});
				}
				else {
					this.setPanel(Panel.TABLE);
					alert('Failed to delete century ' + century.centuryName + '.');
				}
			});
		}
	}

	/**
	 * Opens the edit panel for a Century.
	 * @param century to edit
	 */
	openEdit(century: ct.Century) {
		this.setPanel(Panel.EDIT, s => {
			s.century = century;
			return s;
		});
	}

	/**
	 * Utilizes the sectionProxy to create or update a Century.
	 * @param ctProps properties of the Century.
	 * @param isNew
	 */
	saveCentury(ctProps:ct.Properties, isNew:boolean) {
		this.setLoader('Saving Century ' + ctProps.centuryID + '...');

		var onError = (e:string) => {
			alert('Error creating new Century: ' + e);
			this.setPanel(Panel.EDIT, s => {

				s.editOpts = {
					isNew: isNew,
					ctProps: ctProps,
					val: (e.toLowerCase().indexOf(ctProps.centuryID.toLowerCase()) === - 1
						? null : 'error')
				};
				return s;
			});
		};

		if (isNew) {
			proxyFactory.getSectionProxy().createCentury(ctProps, (century, e?) => {
				if (e) {
					onError(e);
				}

				else {
					this.setPanel(Panel.TABLE, s => {
						s.centuries.push(century);
						return s;
					});
				}
			});
		}

		else {
			proxyFactory.getSectionProxy().updateCentury(ctProps, (century, e?) => {
				if (e) {
					onError(e);
				}

				else {
					this.setPanel(Panel.TABLE, s => {
						var i = s.centuries.findIndex(c => century.centuryID === c.centuryID);
						s.centuries[i].destroy();

						s.centuries[i] = century;
						return s;
					});
				}
			});
		}
	}
}
