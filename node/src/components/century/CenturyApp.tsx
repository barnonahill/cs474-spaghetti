import * as React from 'react';

import PageLoader from '@src/components/common/PageLoader.tsx';

import TablePanel from '@src/components/century/CenturyTablePanel.tsx';
import {
	default as EditPanel,
	S as EditState
} from '@src/components/century/CenturyEditPanel.tsx';

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
	editState?: EditState
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
		};

		// JSX Render Helpers
		this.renderTablePanel = this.renderTablePanel.bind(this);
		this.renderEditPanel = this.renderEditPanel.bind(this);

		// Opener
		this.openEdit = this.openEdit.bind(this);

		// Data manipulation operations
		this.saveCentury = this.saveCentury.bind(this);
		this.deleteCentury = this.deleteCentury.bind(this);

		// State helpers
		this.setPanel = StateUtils.setPanel.bind(this);
		this.setLoader = StateUtils.setLoader.bind(this, Panel.LOADER);
	}

	render() {
		switch (this.state.panel)  {
			case Panel.TABLE:
				return this.renderTablePanel();

			case Panel.EDIT:
				return this.renderEditPanel();

			case Panel.LOADER:
				return <PageLoader inner={this.state.loadMessage}/>;

			default:
				return null;
		}
	}

	renderTablePanel() {
		return (<TablePanel
			centuries={this.props.centuries}
			onBack={this.props.onBack}
			onRefresh={() => {
				this.setLoader('Loading Centuries...');
				this.props.reloadCenturies();
			}}

			onEdit={century => {
				this.setPanel(Panel.EDIT, s => {
					s.century = century;
					return s;
				});
			}}

			onDelete={century => {
				var del = confirm('Delete Century ' + century.centuryID + '?');
				if (del) {
					this.deleteCentury(century);
				}
			}}
		/>);
	}

	renderEditPanel() {
		var es: Partial<EditState> = this.state.editState || {};
		if (!es.ctProps) {
			if (this.state.century) {
				es.ctProps = this.state.century.toProperties();
			}
			else {
				es.ctProps = null;
			}
		}

		return (<EditPanel
			onBack={() => this.setPanel(Panel.TABLE, s => {
				delete s.editState;
				s.century = null;
				return s;
			})}
			onSubmit={this.saveCentury}
			editState={es}
		/>);
	}

	/**
	 * Attempts to delete century using the sectionProxy.
	 * @param century to delete
	 */
	deleteCentury(century: ct.Century) {
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
	saveCentury(editState: EditState) {
		this.setLoader('Saving Century ' + editState.ctProps.centuryID + '...');

		var onError = (e:string) => {
			alert('Error saving Century: ' + e);
			this.setPanel(Panel.EDIT, s => {
				e = e.toLowerCase();
				for (let k in editState.val) {
					if (editState.ctProps[k] && (e.indexOf(editState.ctProps[k]) !== -1 ||
						e.indexOf(k.toLowerCase()) !== -1)) {
							editState.val[k] = 'error';
						}
				}
				s.editState = editState;
				return s;
			});
		};
		const proxy = proxyFactory.getSectionProxy();
		if (editState.isNew) {
			proxy.createCentury(editState.ctProps, (century, e?) => {
				if (e) {
					onError(e);
				}
				else {
					this.setPanel(Panel.TABLE, s => {
						s.centuries.push(century);
						delete s.editState;
						return s;
					});
				}
			});
		}

		else {
			proxy.updateCentury(editState.ctProps, (century, e?) => {
				if (e) {
					onError(e);
				}
				else {
					this.setPanel(Panel.TABLE, s => {
						var i = s.centuries.findIndex(c => century.centuryID === c.centuryID);
						s.centuries[i].destroy();
						s.centuries[i] = century;
						delete s.editState;
						return s;
					});
				}
			});
		}
	}
}
